/**
 * PRAGATI — Learn Page Script
 * ────────────────────────────
 * The interactive learning page: chapter viewer, quiz, progress.
 * URL: learn.html?slug=data-structures-algorithms&chapter=CHAPTER_ID
 */
'use strict';

const API_BASE = window.location.origin + '/api/v1';

function getToken() { return localStorage.getItem('pragati_token'); }
function getUser() {
    try { return JSON.parse(localStorage.getItem('pragati_user')); } catch { return null; }
}
function authHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// Parse URL params
const params = new URLSearchParams(window.location.search);
const courseSlug = params.get('slug');
const chapterId = params.get('chapter');

if (!courseSlug || !chapterId) {
    window.location.href = 'courses.html';
}

// State
let currentCourse = null;
let currentChapter = null;
let allChapters = [];
let selectedAnswers = {};

/* ═══════════════ INIT ═══════════════ */
(async function init() {
    try {
        // Load chapter
        const res = await fetch(`${API_BASE}/chapters/${chapterId}`, { headers: authHeaders() });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        currentChapter = data.chapter;
        allChapters = data.chapters || [];

        // Load course info too
        const courseRes = await fetch(`${API_BASE}/courses/${courseSlug}`, { headers: authHeaders() });
        const courseData = await courseRes.json();
        if (courseData.success) {
            currentCourse = courseData.course;
        }

        renderAll(data);
    } catch (err) {
        console.error('Load error:', err);
        document.getElementById('learnLoading').innerHTML = `
            <div style="text-align:center">
                <div style="font-size:3rem;margin-bottom:1rem">😕</div>
                <h3>Chapter Not Found</h3>
                <p style="color:var(--text-light);">Could not load this chapter. <a href="courses.html" style="color:var(--primary)">Browse courses</a></p>
            </div>`;
    }
})();

/* ═══════════════ RENDER ═══════════════ */
function renderAll(data) {
    const { chapter, chapters, progress } = data;

    // Topbar
    document.getElementById('topbarCourseName').textContent = currentCourse ? currentCourse.title : 'Course';
    document.getElementById('backToCourse').href = `course-detail.html?slug=${courseSlug}`;
    document.title = `${chapter.title} – Pragati`;

    // Update progress bar
    updateProgressBar(chapters);

    // Sidebar chapters
    renderSidebar(chapters);

    // Main content
    renderChapter(chapter, progress);

    // Hide loading
    document.getElementById('learnLoading').style.display = 'none';
    document.getElementById('chapterContent').style.display = 'block';

    // Quiz
    if (chapter.quiz && chapter.quiz.questions && chapter.quiz.questions.length > 0) {
        renderQuiz(chapter.quiz, progress);
    }

    // Check if all chapters completed for certificate
    const allCompleted = chapters.every(ch => ch.isCompleted);
    if (allCompleted && chapters.length > 0) {
        document.getElementById('certificateSection').style.display = 'block';
    }
}

function renderSidebar(chapters) {
    const container = document.getElementById('sidebarChapters');
    container.innerHTML = chapters.map((ch, i) => {
        const isActive = ch._id === chapterId;
        const isCompleted = ch.isCompleted;
        const isLocked = ch.isLocked && !isCompleted && i > 0;
        let cls = '';
        if (isActive) cls = 'active';
        else if (isCompleted) cls = 'completed';
        else if (isLocked) cls = 'locked';

        return `
            <div class="ls-chapter ${cls}" onclick="${!isLocked ? `navigateToChapter('${ch._id}')` : ''}" title="${ch.title}">
                <div class="ls-num">
                    ${isCompleted ? '<i class="fas fa-check"></i>' : (isLocked ? '<i class="fas fa-lock" style="font-size:0.65rem"></i>' : (i + 1))}
                </div>
                <div class="ls-ch-info">
                    <div class="ls-ch-title">${ch.title}</div>
                    <div class="ls-ch-meta">${ch.readTimeMinutes || '—'} min${ch.quizPassed ? ' · ✅ Quiz Passed' : ''}</div>
                </div>
            </div>`;
    }).join('');
}

function renderChapter(chapter, progress) {
    document.getElementById('chapterBadge').textContent = `Chapter ${chapter.order}`;
    document.getElementById('chapterTitle').textContent = chapter.title;
    document.getElementById('chapterReadTime').textContent = chapter.readTimeMinutes || '—';

    // Render markdown content
    if (typeof marked !== 'undefined') {
        document.getElementById('chapterBody').innerHTML = marked.parse(chapter.content || '');
    } else {
        // Fallback: basic markdown-like rendering
        document.getElementById('chapterBody').innerHTML = chapter.content
            ? `<div style="white-space:pre-wrap">${chapter.content}</div>`
            : '<p>No content available.</p>';
    }

    // Navigation buttons
    const currentIndex = allChapters.findIndex(ch => ch._id === chapterId);
    const prevBtn = document.getElementById('prevChapterBtn');
    const nextBtn = document.getElementById('nextChapterBtn');

    if (currentIndex > 0) {
        prevBtn.style.display = 'inline-flex';
        prevBtn.onclick = () => navigateToChapter(allChapters[currentIndex - 1]._id);
    }

    if (currentIndex < allChapters.length - 1) {
        const nextChapter = allChapters[currentIndex + 1];
        if (!nextChapter.isLocked || nextChapter.isCompleted) {
            nextBtn.style.display = 'inline-flex';
            nextBtn.onclick = () => navigateToChapter(nextChapter._id);
        }
    }
}

function renderQuiz(quiz, progress) {
    const quizSection = document.getElementById('quizSection');
    quizSection.style.display = 'block';

    document.getElementById('quizPassScore').textContent = quiz.passingScore || 70;

    const container = document.getElementById('quizQuestions');
    container.innerHTML = quiz.questions.map((q, qi) => {
        return `
            <div class="quiz-q-card" data-qi="${qi}">
                <div class="quiz-q-num">Question ${qi + 1} of ${quiz.questions.length}</div>
                <div class="quiz-q-text">${q.question}</div>
                <div class="quiz-options">
                    ${q.options.map((opt, oi) => `
                        <div class="quiz-option" data-qi="${qi}" data-oi="${oi}" onclick="selectAnswer(${qi}, ${oi})">
                            <div class="quiz-option-circle">${String.fromCharCode(65 + oi)}</div>
                            <span>${opt}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
    }).join('');

    // If already passed, show existing results
    if (progress && progress.quizPassed) {
        showAlreadyPassed(progress);
    }

    // Submit button
    document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);
}

/* ═══════════════ INTERACTIONS ═══════════════ */

window.selectAnswer = function (qi, oi) {
    selectedAnswers[qi] = oi;

    // Update UI
    document.querySelectorAll(`.quiz-option[data-qi="${qi}"]`).forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`.quiz-option[data-qi="${qi}"][data-oi="${oi}"]`).classList.add('selected');
};

async function submitQuiz() {
    const token = getToken();
    if (!token) {
        alert('Please login to submit the quiz.');
        return;
    }

    const quiz = currentChapter.quiz;
    const totalQ = quiz.questions.length;
    const answers = [];
    for (let i = 0; i < totalQ; i++) {
        if (selectedAnswers[i] === undefined) {
            alert(`Please answer Question ${i + 1} before submitting.`);
            return;
        }
        answers.push(selectedAnswers[i]);
    }

    const btn = document.getElementById('submitQuizBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
        const res = await fetch(`${API_BASE}/chapters/${chapterId}/quiz`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ answers }),
        });
        const data = await res.json();

        if (data.success) {
            showQuizResults(data);
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        console.error('Quiz submit error:', err);
        alert('Failed to submit quiz. ' + (err.message || ''));
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Submit Answers';
    }
}

function showQuizResults(data) {
    const { score, passed, correct, total, passingScore, results } = data;

    // Hide submit button
    document.getElementById('submitQuizBtn').style.display = 'none';

    // Show results
    const resultsDiv = document.getElementById('quizResults');
    resultsDiv.style.display = 'block';

    const headerDiv = document.getElementById('qrHeader');
    headerDiv.className = `qr-header ${passed ? 'passed' : 'failed'}`;
    headerDiv.innerHTML = passed
        ? `🎉 Quiz Passed! Score: ${score}%`
        : `😔 Score: ${score}% — Need ${passingScore}% to pass`;

    document.getElementById('qrDetails').textContent = `You got ${correct} out of ${total} correct.`;

    const actionsDiv = document.getElementById('qrActions');
    if (passed) {
        // Find next chapter
        const currentIndex = allChapters.findIndex(ch => ch._id === chapterId);
        const nextChapter = allChapters[currentIndex + 1];
        actionsDiv.innerHTML = nextChapter
            ? `<button class="btn btn-primary btn-pill" onclick="navigateToChapter('${nextChapter._id}')"><i class="fas fa-arrow-right"></i> Next Chapter</button>`
            : `<button class="btn btn-primary btn-pill" onclick="document.getElementById('certificateSection').style.display='block'; document.getElementById('certificateSection').scrollIntoView({behavior:'smooth'})"><i class="fas fa-certificate"></i> Get Certificate</button>`;
    } else {
        actionsDiv.innerHTML = `<button class="btn btn-secondary btn-pill" onclick="window.location.reload()"><i class="fas fa-redo"></i> Try Again</button>`;
    }

    // Mark correct/incorrect options
    if (results) {
        results.forEach((r, i) => {
            const options = document.querySelectorAll(`.quiz-option[data-qi="${i}"]`);
            options.forEach((opt, oi) => {
                opt.style.pointerEvents = 'none';
                if (oi === r.correctAnswer) {
                    opt.classList.add('correct');
                } else if (oi === r.yourAnswer && !r.isCorrect) {
                    opt.classList.add('incorrect');
                }
            });

            // Add explanation
            if (r.explanation) {
                const card = document.querySelector(`.quiz-q-card[data-qi="${i}"]`);
                card.insertAdjacentHTML('beforeend', `
                    <div class="quiz-explanation">
                        <strong>💡 Explanation:</strong> ${r.explanation}
                    </div>`);
            }
        });
    }
}

function showAlreadyPassed(progress) {
    document.getElementById('submitQuizBtn').style.display = 'none';
    const resultsDiv = document.getElementById('quizResults');
    resultsDiv.style.display = 'block';
    document.getElementById('qrHeader').className = 'qr-header passed';
    document.getElementById('qrHeader').innerHTML = `✅ You've already passed! Score: ${progress.quizScore}%`;
    document.getElementById('qrDetails').textContent = `Quiz completed on ${new Date(progress.completedAt).toLocaleDateString()}`;

    const currentIndex = allChapters.findIndex(ch => ch._id === chapterId);
    const nextChapter = allChapters[currentIndex + 1];
    document.getElementById('qrActions').innerHTML = nextChapter
        ? `<button class="btn btn-primary btn-pill" onclick="navigateToChapter('${nextChapter._id}')"><i class="fas fa-arrow-right"></i> Next Chapter</button>`
        : '';
}

function updateProgressBar(chapters) {
    const completed = chapters.filter(ch => ch.isCompleted).length;
    const total = chapters.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('topbarProgress').style.width = pct + '%';
    document.getElementById('topbarProgressText').textContent = pct + '%';
}

window.navigateToChapter = function (id) {
    window.location.href = `learn.html?slug=${courseSlug}&chapter=${id}`;
};

/* ═══════════════ CERTIFICATE ═══════════════ */
document.getElementById('getCertBtn')?.addEventListener('click', async () => {
    const token = getToken();
    if (!token) { alert('Please login.'); return; }
    if (!currentCourse) return;

    const btn = document.getElementById('getCertBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
        const res = await fetch(`${API_BASE}/my/certificate/${currentCourse._id}`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success && data.certificate) {
            btn.style.display = 'none';
            const display = document.getElementById('certDisplay');
            display.style.display = 'block';
            display.innerHTML = `
                <h3>🏆 Certificate of Completion</h3>
                <p style="font-size:1.25rem;font-weight:700;color:var(--gray-800);margin:0.75rem 0">${data.certificate.userName}</p>
                <p style="color:var(--text-med)">has successfully completed</p>
                <p style="font-size:1.1rem;font-weight:700;color:var(--primary);margin:0.5rem 0">${data.certificate.courseName}</p>
                <p style="color:var(--text-light);font-size:0.85rem">Issued: ${new Date(data.certificate.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <div class="cert-id">Certificate ID: ${data.certificate.certificateId}</div>
            `;
        }
    } catch (err) {
        console.error('Certificate error:', err);
        alert('Failed to generate certificate.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-certificate"></i> Get Your Certificate';
    }
});

/* ═══════════════ SIDEBAR TOGGLE ═══════════════ */
const sidebar = document.getElementById('learnSidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');

toggleBtn.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
});
