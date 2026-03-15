/**
 * PRAGATI — User Dashboard Script
 * ─────────────────────────────────
 * Loads real user data from API: enrolled courses, progress, certificates, profile settings.
 */
'use strict';

const API_BASE = window.location.origin + '/api/v1';

function getToken() { return localStorage.getItem('pragati_token'); }
function getUser() { try { return JSON.parse(localStorage.getItem('pragati_user')); } catch { return null; } }
function authHeaders() {
    const t = getToken();
    return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

/* ═══════════════ INIT ═══════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    // Only run on user-dashboard page (admin-dashboard has its own admin.js)
    const isUserDashboard = window.location.pathname.includes('user-dashboard');
    if (!isUserDashboard) return;

    // Auth guard
    if (!getToken()) {
        window.location.href = 'login.html?redirect=user-dashboard.html';
        return;
    }

    const user = getUser();
    if (user && user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    initSidebarNav();
    initLogout();
    await loadDashboard();
});

/* ═══════════════ SIDEBAR NAV ═══════════════ */
function initSidebarNav() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href')?.replace('#', '');
            if (!target) return;

            navLinks.forEach(l => l.closest('.nav-item')?.classList.remove('active'));
            link.closest('.nav-item')?.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) targetSection.classList.add('active');
        });
    });
}

function initLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('pragati_token');
        localStorage.removeItem('pragati_user');
        window.location.href = 'login.html';
    });
}

/* ═══════════════ LOAD DASHBOARD ═══════════════ */
async function loadDashboard() {
    try {
        // Load user profile
        const profileRes = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
        const profileData = await profileRes.json();

        if (profileData.success) {
            const u = profileData.user;
            document.getElementById('userName').textContent = `${u.firstName} ${u.lastName}`;
            document.getElementById('userEmail').textContent = u.email;
            document.getElementById('welcomeName').textContent = u.firstName || 'Student';

            // Fill settings form
            const sfn = document.getElementById('settingsUsername');
            if (sfn) sfn.value = `${u.firstName} ${u.lastName}`;
            const se = document.getElementById('settingsEmail');
            if (se) se.value = u.email;
        }

        // Load enrolled courses
        const coursesRes = await fetch(`${API_BASE}/my/courses`, { headers: authHeaders() });
        const coursesData = await coursesRes.json();

        if (coursesData.success) {
            renderStats(coursesData);
            renderEnrolledCourses(coursesData.enrollments || []);
            renderProgress(coursesData.enrollments || []);
            renderActivity(coursesData.enrollments || []);
        }

        // Load certificates
        loadCertificates();

    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}

/* ═══════════════ STATS ═══════════════ */
function renderStats(data) {
    const enrollments = data.enrollments || [];
    const completed = enrollments.filter(e => e.completed);

    document.getElementById('totalCourses').textContent = enrollments.length;
    document.getElementById('certificatesEarned').textContent = completed.length;

    // Estimate hours from progress
    const totalProgress = enrollments.reduce((sum, e) => sum + (e.overallProgress || 0), 0);
    const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;
    const estimatedHours = Math.round(enrollments.length * 12 * (avgProgress / 100));
    document.getElementById('totalHours').textContent = estimatedHours;

    // Average quiz score
    document.getElementById('averageScore').textContent = avgProgress + '%';

    // Animate stats
    document.querySelectorAll('.stat-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s cubic-bezier(0.16,1,0.3,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + i * 100);
    });
}

/* ═══════════════ ENROLLED COURSES ═══════════════ */
function renderEnrolledCourses(enrollments) {
    const grid = document.getElementById('userCoursesGrid');
    if (!grid) return;

    if (enrollments.length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:3rem">
                <div style="font-size:4rem; margin-bottom:1rem">📚</div>
                <h3 style="margin-bottom:0.5rem; color:#333">No Courses Enrolled Yet</h3>
                <p style="color:#6c757d; margin-bottom:1.5rem">Start your learning journey by exploring our courses!</p>
                <a href="courses.html" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:linear-gradient(135deg,#667eea,#764ba2);color:white;border-radius:10px;text-decoration:none;font-weight:600">
                    <i class="fas fa-search"></i> Browse Courses
                </a>
            </div>`;
        return;
    }

    grid.innerHTML = enrollments.map(e => {
        const course = e.course || {};
        const progress = e.overallProgress || 0;
        const statusClass = e.completed ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';
        const statusText = e.completed ? '✅ Completed' : progress > 0 ? `${progress}% Complete` : 'Not Started';
        const statusColor = e.completed ? '#10b981' : progress > 0 ? '#f59e0b' : '#94a3b8';

        return `
            <div class="course-card" style="cursor:pointer" onclick="window.location.href='course-detail.html?slug=${course.slug}'">
                <div class="course-image" style="background:linear-gradient(135deg, ${getGradient(course.category)})">
                    <span style="font-size:3rem">${course.icon || '📖'}</span>
                    <span style="position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.3);color:white;padding:0.25rem 0.75rem;border-radius:50px;font-size:0.75rem;font-weight:600;backdrop-filter:blur(4px)">${statusText}</span>
                </div>
                <div class="course-content">
                    <h3>${course.title || 'Course'}</h3>
                    <p>${course.stream?.toUpperCase() || ''} · ${course.degree?.toUpperCase() || ''}</p>
                    <div class="progress-bar" style="margin:1rem 0 0.5rem">
                        <div class="progress-fill" style="width:${progress}%;background:${statusColor}"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#6c757d">
                        <span>${progress}% complete</span>
                        <span>${e.completed ? 'Certificate Available' : 'In Progress'}</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

/* ═══════════════ PROGRESS ═══════════════ */
function renderProgress(enrollments) {
    const circle = document.getElementById('progressCircle');
    const pctEl = document.getElementById('progressPercentage');
    const progList = document.getElementById('progressList');

    const totalProgress = enrollments.reduce((sum, e) => sum + (e.overallProgress || 0), 0);
    const avgProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

    // Animate circle
    if (circle && pctEl) {
        const circumference = 2 * Math.PI * 80;
        const offset = circumference - (avgProgress / 100) * circumference;
        setTimeout(() => {
            circle.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)';
            circle.setAttribute('stroke-dashoffset', offset);
        }, 300);
        pctEl.textContent = avgProgress + '%';
    }

    // Progress list
    if (progList) {
        progList.innerHTML = enrollments.map(e => {
            const course = e.course || {};
            const progress = e.overallProgress || 0;
            const color = progress >= 100 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#667eea';
            return `
                <div class="progress-item" style="cursor:pointer" onclick="window.location.href='course-detail.html?slug=${course.slug}'">
                    <div style="flex:1">
                        <h4>${course.title || 'Course'}</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${progress}%;background:${color}"></div>
                        </div>
                        <span style="font-size:0.8rem;color:#6c757d">${progress}% complete</span>
                    </div>
                </div>`;
        }).join('');

        if (enrollments.length === 0) {
            progList.innerHTML = '<p style="color:#6c757d;text-align:center;padding:2rem">No progress data yet. Enroll in a course to start tracking!</p>';
        }
    }
}

/* ═══════════════ ACTIVITY ═══════════════ */
function renderActivity(enrollments) {
    const list = document.getElementById('activityList');
    if (!list) return;

    const activities = [];
    enrollments.forEach(e => {
        const course = e.course || {};
        activities.push({
            icon: 'fa-book',
            title: `Enrolled in ${course.title || 'a course'}`,
            detail: `${e.overallProgress || 0}% completed`,
            color: '#667eea',
            time: e.createdAt,
        });

        if (e.completed) {
            activities.push({
                icon: 'fa-trophy',
                title: `Completed ${course.title || 'a course'}`,
                detail: 'Certificate available',
                color: '#10b981',
                time: e.completedAt || e.updatedAt,
            });
        }
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    if (activities.length === 0) {
        list.innerHTML = '<p style="color:#6c757d;text-align:center;padding:2rem">No recent activity. Start learning to see your progress here!</p>';
        return;
    }

    list.innerHTML = activities.slice(0, 8).map(a => `
        <div class="activity-item">
            <div class="activity-icon" style="background:${a.color}">
                <i class="fas ${a.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${a.title}</h4>
                <p>${a.detail}</p>
            </div>
            <span class="activity-time">${timeAgo(a.time)}</span>
        </div>
    `).join('');
}

/* ═══════════════ CERTIFICATES ═══════════════ */
async function loadCertificates() {
    const grid = document.getElementById('certificatesGrid');
    if (!grid) return;

    try {
        const res = await fetch(`${API_BASE}/my/courses`, { headers: authHeaders() });
        const data = await res.json();
        if (!data.success) return;

        const completed = (data.enrollments || []).filter(e => e.completed);

        if (completed.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem">
                    <div style="font-size:4rem;margin-bottom:1rem">🏆</div>
                    <h3 style="margin-bottom:0.5rem;color:#333">No Certificates Yet</h3>
                    <p style="color:#6c757d">Complete a course to earn your first certificate!</p>
                </div>`;
            return;
        }

        grid.innerHTML = completed.map(e => {
            const course = e.course || {};
            return `
                <div class="certificate-card">
                    <div class="certificate-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <h3>${course.title || 'Course'}</h3>
                    <p style="color:#6c757d;margin:0.5rem 0">Completed Course</p>
                    <button class="btn btn-primary" style="margin-top:1rem;padding:0.6rem 1.2rem;background:linear-gradient(135deg,#ffd700,#ffed4e);color:#333;border:none;border-radius:8px;font-weight:600;cursor:pointer" onclick="generateCert('${course._id}')">
                        <i class="fas fa-download"></i> View Certificate
                    </button>
                </div>`;
        }).join('');
    } catch (err) {
        console.error('Certificates error:', err);
    }
}

window.generateCert = async function(courseId) {
    try {
        const res = await fetch(`${API_BASE}/my/certificate/${courseId}`, {
            method: 'POST',
            headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success && data.certificate) {
            alert(`🏆 Certificate ID: ${data.certificate.certificateId}\n\nIssued to: ${data.certificate.userName}\nCourse: ${data.certificate.courseName}\nDate: ${new Date(data.certificate.issuedAt).toLocaleDateString()}`);
        }
    } catch (err) {
        console.error('Certificate generation error:', err);
    }
};

/* ═══════════════ SETTINGS ═══════════════ */
document.getElementById('profileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameParts = (document.getElementById('settingsUsername')?.value || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const newPassword = document.querySelector('[name="newPassword"]')?.value;
    const confirmPassword = document.querySelector('[name="confirmPassword"]')?.value;

    if (newPassword && newPassword !== confirmPassword) {
        showDashToast('Passwords do not match!', 'error');
        return;
    }

    const body = { firstName, lastName };
    if (newPassword) {
        body.newPassword = newPassword;
        body.currentPassword = prompt('Enter your current password to confirm:');
        if (!body.currentPassword) return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (data.success) {
            // Update stored user data — this syncs to nav-auth profile dropdown
            localStorage.setItem('pragati_user', JSON.stringify(data.user));
            showDashToast('Profile updated successfully!', 'success');
            // Update sidebar info
            const nameEl = document.getElementById('userName');
            const welEl = document.getElementById('welcomeName');
            if (nameEl) nameEl.textContent = data.user.name;
            if (welEl) welEl.textContent = firstName;
            // Reload nav-auth profile (if it has re-render function)
            if (window._navAuthRefresh) window._navAuthRefresh();
            // Clear password fields
            document.querySelector('[name="newPassword"]').value = '';
            document.querySelector('[name="confirmPassword"]').value = '';
        } else {
            showDashToast(data.error || 'Failed to update profile', 'error');
        }
    } catch (err) {
        console.error('Profile update error:', err);
        showDashToast('Network error. Please try again.', 'error');
    } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
    }
});

/* ═══════════════ QUICK ACTIONS ═══════════════ */
window.resumeLastCourse = function () {
    const user = getUser();
    window.location.href = 'courses.html';
};

window.browseCourses = function () {
    window.location.href = 'courses.html';
};

window.viewCertificates = function () {
    // Switch to certificates tab
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    const certSection = document.getElementById('certificates');
    if (certSection) certSection.classList.add('active');
    const certNavItem = document.querySelector('.sidebar-nav a[href="#certificates"]')?.closest('.nav-item');
    if (certNavItem) certNavItem.classList.add('active');
};

window.updateProfile = function () {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    const settingsSection = document.getElementById('settings');
    if (settingsSection) settingsSection.classList.add('active');
    const settingsNavItem = document.querySelector('.sidebar-nav a[href="#settings"]')?.closest('.nav-item');
    if (settingsNavItem) settingsNavItem.classList.add('active');
};

window.showNotificationCenter = function () {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.add('active');
        const list = document.getElementById('notificationList');
        if (list) {
            list.innerHTML = `
                <div class="activity-item"><div class="activity-icon" style="background:#667eea"><i class="fas fa-info-circle"></i></div><div class="activity-content"><h4>Welcome to Pragati!</h4><p>Start exploring courses and track your progress</p></div><span class="activity-time">Just now</span></div>
                <div class="activity-item"><div class="activity-icon" style="background:#10b981"><i class="fas fa-gift"></i></div><div class="activity-content"><h4>Free courses available</h4><p>All courses are free to enroll and learn</p></div><span class="activity-time">Today</span></div>
            `;
        }
    }
};

window.closeNotificationCenter = function () {
    const modal = document.getElementById('notificationModal');
    if (modal) modal.classList.remove('active');
};

/* ═══════════════ TOAST ═══════════════ */
function showDashToast(message, type = 'info') {
    const existing = document.querySelector('.dash-toast');
    if (existing) existing.remove();
    const colors = { success: 'linear-gradient(135deg,#10b981,#059669)', error: 'linear-gradient(135deg,#ef4444,#dc2626)', info: 'linear-gradient(135deg,#4f46e5,#7c3aed)' };
    const icons = { success: 'check-circle', error: 'times-circle', info: 'info-circle' };
    const t = document.createElement('div');
    t.className = 'dash-toast';
    t.innerHTML = `<i class="fas fa-${icons[type]}"></i> <span>${message}</span>`;
    t.style.cssText = `position:fixed;top:80px;right:20px;z-index:10000;background:${colors[type]};color:white;padding:0.85rem 1.5rem;border-radius:12px;font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:0.6rem;box-shadow:0 8px 24px rgba(0,0,0,0.2);transform:translateX(400px);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; });
    setTimeout(() => { if (t.parentElement) { t.style.transform = 'translateX(400px)'; setTimeout(() => t.remove(), 300); } }, 4000);
}

/* ═══════════════ HELPERS ═══════════════ */
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

function getGradient(category) {
    const gradients = {
        'Technology': '#4f46e5, #7c3aed',
        'Business': '#0d9488, #059669',
        'Design': '#ec4899, #f43f5e',
        'Science': '#3b82f6, #6366f1',
        'Medical': '#ef4444, #f97316',
    };
    return gradients[category] || '#667eea, #764ba2';
}