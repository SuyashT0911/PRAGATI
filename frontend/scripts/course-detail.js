/**
 * PRAGATI — Course Detail Page Script
 * ─────────────────────────────────────
 * Loads course details from the API and renders them.
 * URL: course-detail.html?slug=data-structures-algorithms
 */
'use strict';

const API_BASE = window.location.origin + '/api/v1';

// Get auth token
function getToken() { return localStorage.getItem('pragati_token'); }
function getUser() {
    try { return JSON.parse(localStorage.getItem('pragati_user')); } catch { return null; }
}
function authHeaders() {
    const token = getToken();
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const courseSlug = params.get('slug');

if (!courseSlug) {
    window.location.href = 'courses.html';
}

// Main
(async function init() {
    try {
        const res = await fetch(`${API_BASE}/courses/${courseSlug}`, { headers: authHeaders() });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        renderCourse(data);
    } catch (err) {
        console.error('Failed to load course:', err);
        document.getElementById('loadingState').innerHTML = `
            <div style="text-align:center">
                <div style="font-size:3rem;margin-bottom:1rem">😕</div>
                <h3>Course Not Found</h3>
                <p style="color:var(--text-light);margin:0.5rem 0 1.5rem">This course may have been removed or the URL is incorrect.</p>
                <a href="courses.html" class="btn btn-primary btn-pill">Browse All Courses</a>
            </div>`;
    }
})();

function renderCourse({ course, chapters, isEnrolled, enrollment }) {
    document.title = `${course.title} – Pragati`;

    // Hero
    document.getElementById('heroTitle').textContent = course.title;
    document.getElementById('heroDesc').textContent = course.description;
    document.getElementById('heroDegree').textContent = course.degree.toUpperCase();
    document.getElementById('heroStream').textContent = course.stream.toUpperCase();
    document.getElementById('heroHours').textContent = `${course.estimatedHours || '—'} hours`;
    document.getElementById('heroChapters').textContent = chapters.length;
    document.getElementById('heroDifficulty').textContent = capitalize(course.difficulty);
    document.getElementById('heroRating').textContent = `${course.rating} (${formatCount(course.ratingCount)})`;
    document.getElementById('heroEnrollCount').textContent = formatCount(course.enrollCount);
    document.getElementById('heroIcon').textContent = course.icon;

    // Sidebar
    document.getElementById('sidebarDegree').textContent = course.degree.toUpperCase();
    document.getElementById('sidebarStream').textContent = course.stream.toUpperCase();
    document.getElementById('sidebarSemester').textContent = course.semester ? `Semester ${course.semester}` : '—';
    document.getElementById('sidebarCredits').textContent = course.credits || '—';
    document.getElementById('sidebarUniversity').textContent = course.university === 'universal' ? 'Universal' : course.university.toUpperCase();

    // Tags
    const tagsEl = document.getElementById('sidebarTags');
    tagsEl.innerHTML = (course.tags || []).map(t => `<span>${t}</span>`).join('');

    // Chapters list
    const listEl = document.getElementById('chaptersList');
    listEl.innerHTML = chapters.map((ch, i) => {
        const isFirst = i === 0;
        const canAccess = isFirst || (isEnrolled && !ch.isLocked);
        const lockedClass = canAccess ? '' : 'locked';
        return `
            <div class="chapter-item ${lockedClass}" data-id="${ch._id}" data-order="${ch.order}" onclick="${canAccess ? `goToLearn('${course.slug}', '${ch._id}')` : ''}">
                <div class="ci-number">${canAccess ? (i + 1) : '<i class="fas fa-lock" style="font-size:0.75rem"></i>'}</div>
                <div class="ci-info">
                    <div class="ci-title">${ch.title}</div>
                    ${ch.summary ? `<div class="ci-summary">${ch.summary}</div>` : ''}
                    <div class="ci-meta">
                        <span><i class="fas fa-clock"></i> ${ch.readTimeMinutes} min</span>
                        ${ch.hasQuiz ? '<span><i class="fas fa-brain"></i> Quiz</span>' : ''}
                    </div>
                </div>
                ${canAccess ? '<i class="fas fa-chevron-right ci-arrow"></i>' : '<i class="fas fa-lock ci-lock"></i>'}
            </div>
        `;
    }).join('');

    // Enrollment UI
    const enrollBtn = document.getElementById('enrollBtn');
    const continueBtn = document.getElementById('continueBtn');
    const progressCard = document.getElementById('progressCard');

    if (isEnrolled) {
        enrollBtn.style.display = 'none';
        continueBtn.style.display = 'inline-flex';
        continueBtn.addEventListener('click', () => {
            goToLearn(course.slug, chapters[0]._id);
        });

        // Show progress
        if (enrollment) {
            progressCard.style.display = 'block';
            document.getElementById('progressFill').style.width = enrollment.overallProgress + '%';
            document.getElementById('progressText').textContent = enrollment.overallProgress + '% Complete';
        }
    } else {
        enrollBtn.addEventListener('click', () => enrollInCourse(course._id, course.slug, chapters));
    }

    // Show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('courseContent').style.display = 'block';
}

async function enrollInCourse(courseId, slug, chapters) {
    const token = getToken();
    if (!token) {
        alert('Please login to enroll in courses.');
        window.location.href = `login.html?redirect=course-detail.html?slug=${slug}`;
        return;
    }

    const enrollBtn = document.getElementById('enrollBtn');
    enrollBtn.disabled = true;
    enrollBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enrolling...';

    try {
        const res = await fetch(`${API_BASE}/enroll/${courseId}`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();

        if (data.success) {
            enrollBtn.innerHTML = '<i class="fas fa-check"></i> Enrolled!';
            enrollBtn.style.background = 'var(--success)';
            setTimeout(() => {
                goToLearn(slug, chapters[0]._id);
            }, 800);
        } else {
            throw new Error(data.error);
        }
    } catch (err) {
        console.error('Enrollment error:', err);
        enrollBtn.disabled = false;
        enrollBtn.innerHTML = '<i class="fas fa-play-circle"></i> Enroll Free & Start Learning';
        alert('Failed to enroll. ' + (err.message || 'Please try again.'));
    }
}

function goToLearn(slug, chapterId) {
    window.location.href = `learn.html?slug=${slug}&chapter=${chapterId}`;
}

// Helpers
function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function formatCount(n) {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
}

// Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
});
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Mobile nav
const mobileOverlay = document.getElementById('mobileOverlay');
const mobilePanel = document.getElementById('mobilePanel');
const closeMobileNav = () => { mobileOverlay.classList.remove('open'); mobilePanel.classList.remove('open'); document.body.style.overflow = ''; };
const openMobileNav = () => { mobileOverlay.classList.add('open'); mobilePanel.classList.add('open'); document.body.style.overflow = 'hidden'; };
document.getElementById('hamburger').addEventListener('click', openMobileNav);
document.getElementById('mobileClose').addEventListener('click', closeMobileNav);
mobileOverlay.addEventListener('click', (e) => { if (!e.target.closest('#mobilePanel')) closeMobileNav(); });

// Reveal animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
