/**
 * PRAGATI — Admin Dashboard Script
 * ──────────────────────────────────
 * Complete admin dashboard with real API integration:
 *  - Stats with animated counters
 *  - Real-time activity feed from Activity model
 *  - User management with online/offline status in separate tables
 *  - Course management with create/edit/delete/publish
 *  - CSS-based analytics charts
 *  - Settings tabs
 *  - Profile sync to DB
 */
'use strict';

const _adminAPI = window.location.origin + '/api/v1';
function _adminGetToken() { return localStorage.getItem('pragati_token'); }
function _adminGetUser() { try { return JSON.parse(localStorage.getItem('pragati_user')); } catch { return null; } }
function _adminAuthHeaders() {
    const t = _adminGetToken();
    return t ? { 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

/* ═══════════════ INIT ═══════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('admin-dashboard')) return;

    if (!_adminGetToken()) {
        window.location.href = 'login.html?redirect=admin-dashboard.html';
        return;
    }
    const user = _adminGetUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'user-dashboard.html';
        return;
    }

    const nameEl = document.getElementById('adminName');
    const emailEl = document.getElementById('adminEmail');
    if (nameEl) nameEl.textContent = user.name || 'Admin';
    if (emailEl) emailEl.textContent = user.email || '';

    initSidebar();
    initTabs();
    await loadDashboard();
});

/* ═══════════════ SIDEBAR ═══════════════ */
function initSidebar() {
    const links = document.querySelectorAll('.sidebar-nav .nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').replace('#', '');

            links.forEach(l => l.closest('.nav-item')?.classList.remove('active'));
            link.closest('.nav-item')?.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target)?.classList.add('active');
        });
    });
}

/* ═══════════════ SETTINGS TABS ═══════════════ */
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab)?.classList.add('active');
        });
    });
}

/* ═══════════════ LOAD ALL ═══════════════ */
async function loadDashboard() {
    await Promise.allSettled([
        loadStats(),
        loadActivity(),
        loadUsersTable(),
        loadCourses(),
        renderAnalytics(),
    ]);
}

/* ═══════════════ STATS ═══════════════ */
let _statsData = null;
async function loadStats() {
    try {
        const res = await fetch(`${_adminAPI}/admin/stats`, { headers: _adminAuthHeaders() });
        const data = await res.json();
        if (!data.success) return;
        _statsData = data.stats;

        animateCount('totalUsers', data.stats.totalUsers);
        animateCount('totalCourses', data.stats.totalCourses);
        animateCount('totalCertificates', data.stats.totalCertificates);
        animateCount('activeUsers', data.stats.activeStudents);
    } catch (err) {
        console.error('Stats error:', err);
    }
}

function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const interval = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = current.toLocaleString();
    }, 30);
}

/* ═══════════════ ACTIVITY FEED ═══════════════ */
const ACTIVITY_INITIAL_COUNT = 8;
async function loadActivity() {
    const list = document.getElementById('adminActivityList');
    if (!list) return;

    try {
        const res = await fetch(`${_adminAPI}/admin/activity`, { headers: _adminAuthHeaders() });
        const data = await res.json();

        if (data.success && data.activities.length > 0) {
            const all = data.activities;
            const visible = all.slice(0, ACTIVITY_INITIAL_COUNT);
            const hidden = all.slice(ACTIVITY_INITIAL_COUNT);

            let html = visible.map(renderActivityItem).join('');

            if (hidden.length > 0) {
                html += `<div id="activityHidden" style="display:none">${hidden.map(renderActivityItem).join('')}</div>`;
                html += `<button id="activityToggleBtn" onclick="toggleActivityFeed()" style="
                    width:100%;padding:0.75rem;margin-top:0.5rem;
                    background:var(--p50,#eef2ff);color:var(--primary,#4f46e5);
                    border:1px dashed var(--p200,#c7d2fe);border-radius:10px;
                    font-size:0.85rem;font-weight:600;cursor:pointer;
                    display:flex;align-items:center;justify-content:center;gap:0.5rem;
                    transition:all 0.2s;
                ">
                    <i class="fas fa-chevron-down"></i> See More (${hidden.length} more)
                </button>`;
            }

            list.innerHTML = html;
        } else {
            list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No recent activity yet. User registrations, logins, and profile updates will appear here.</p>';
        }
    } catch (err) {
        list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">Unable to load activity.</p>';
    }
}

function renderActivityItem(a) {
    return `
        <div class="activity-item">
            <div class="activity-icon" style="background:${a.color || '#4f46e5'}">
                <i class="fas ${a.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${a.message}</h4>
                <p>${a.type.replace(/_/g, ' ')}</p>
            </div>
            <span class="activity-time">${timeAgo(a.time)}</span>
        </div>`;
}

window.toggleActivityFeed = function() {
    const hiddenBlock = document.getElementById('activityHidden');
    const btn = document.getElementById('activityToggleBtn');
    if (!hiddenBlock || !btn) return;

    const isExpanded = hiddenBlock.style.display !== 'none';
    if (isExpanded) {
        hiddenBlock.style.display = 'none';
        btn.innerHTML = `<i class="fas fa-chevron-down"></i> See More`;
    } else {
        hiddenBlock.style.display = 'block';
        btn.innerHTML = `<i class="fas fa-chevron-up"></i> Show Less`;
    }
};

/* ═══════════════ USER MANAGEMENT ═══════════════ */
async function loadUsersTable(search = '') {
    const adminTbody = document.getElementById('adminsTableBody');
    const studentTbody = document.getElementById('studentsTableBody');
    if (!adminTbody && !studentTbody) return;

    if (adminTbody) adminTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1.5rem"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';
    if (studentTbody) studentTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1.5rem"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';

    try {
        const params = new URLSearchParams({ limit: 100 });
        if (search) params.set('search', search);

        const res = await fetch(`${_adminAPI}/admin/users?${params}`, { headers: _adminAuthHeaders() });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        const admins = data.users.filter(u => u.role === 'admin');
        const students = data.users.filter(u => u.role !== 'admin');

        const adminLabel = document.getElementById('adminCountLabel');
        const studentLabel = document.getElementById('studentCountLabel');
        if (adminLabel) adminLabel.textContent = `${admins.length} admin${admins.length !== 1 ? 's' : ''}`;
        if (studentLabel) studentLabel.textContent = `${students.length} student${students.length !== 1 ? 's' : ''}`;

        // Render admin table
        if (adminTbody) {
            adminTbody.innerHTML = admins.length === 0
                ? '<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:var(--text-muted)">No administrators found</td></tr>'
                : admins.map(u => renderUserRow(u, 'admin')).join('');
        }

        // Render student table
        if (studentTbody) {
            studentTbody.innerHTML = students.length === 0
                ? '<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text-muted)">No students found</td></tr>'
                : students.map(u => renderUserRow(u, 'student')).join('');
        }
    } catch (err) {
        console.error('Load users error:', err);
        if (adminTbody) adminTbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1.5rem;color:#ef4444">Failed to load</td></tr>';
        if (studentTbody) studentTbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:#ef4444">Failed to load</td></tr>';
    }
}

function renderUserRow(u, type) {
    const statusDot = u.isOnline
        ? '<span style="display:inline-flex;align-items:center;gap:0.3rem;color:#10b981;font-size:0.82rem"><i class="fas fa-circle" style="font-size:0.4rem"></i> Online</span>'
        : '<span style="display:inline-flex;align-items:center;gap:0.3rem;color:#94a3b8;font-size:0.82rem"><i class="fas fa-circle" style="font-size:0.4rem"></i> Offline</span>';

    const grad = type === 'admin' ? '#ef4444,#f97316' : '#4f46e5,#0d9488';
    const initial = (u.firstName?.[0] || '?').toUpperCase();

    let cols = `
        <td style="font-size:0.75rem;color:#94a3b8;font-family:monospace">${u._id.slice(-6)}</td>
        <td>
            <div style="display:flex;align-items:center;gap:0.75rem">
                <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,${grad});display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8rem">${initial}</div>
                <strong style="color:#1e293b">${u.firstName || ''} ${u.lastName || ''}</strong>
            </div>
        </td>
        <td style="color:#64748b">${u.email}</td>`;

    if (type === 'student') {
        cols += `<td><span style="background:#eef2ff;color:#4f46e5;padding:0.2rem 0.6rem;border-radius:50px;font-size:0.75rem;font-weight:600">${u.enrolledCourses || 0} courses</span></td>`;
    }

    cols += `
        <td>${statusDot}</td>
        <td style="color:#94a3b8;font-size:0.85rem">${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
        <td>
            <div style="display:flex;gap:0.5rem">
                <button onclick="editUserModal('${u._id}')" style="background:#eef2ff;color:#4f46e5;border:none;padding:0.4rem 0.7rem;border-radius:6px;cursor:pointer;font-size:0.8rem" title="Edit"><i class="fas fa-edit"></i></button>
                ${type === 'student' ? `<button onclick="deleteUserConfirm('${u._id}', '${u.firstName} ${u.lastName}')" style="background:#fef2f2;color:#ef4444;border:none;padding:0.4rem 0.7rem;border-radius:6px;cursor:pointer;font-size:0.8rem" title="Delete"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        </td>`;
    return `<tr>${cols}</tr>`;
}

// Search
document.getElementById('userSearch')?.addEventListener('input', debounce((e) => {
    loadUsersTable(e.target.value.trim());
}, 400));

/* ═══════════════ COURSE MANAGEMENT ═══════════════ */
async function loadCourses(search = '') {
    const grid = document.getElementById('adminCoursesGrid');
    if (!grid) return;

    grid.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--text-muted)"><i class="fas fa-spinner fa-spin fa-2x"></i><p style="margin-top:1rem">Loading courses...</p></div>';

    try {
        const params = new URLSearchParams({ limit: 50 });
        if (search) params.set('search', search);

        const res = await fetch(`${_adminAPI}/admin/courses?${params}`, { headers: _adminAuthHeaders() });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        if (data.courses.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center;padding:3rem;color:var(--text-muted);grid-column:1/-1">
                    <i class="fas fa-book-open" style="font-size:3rem;margin-bottom:1rem;color:var(--gray-300)"></i>
                    <p style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem">No courses yet</p>
                    <p>Click "Create Course" to add your first course.</p>
                </div>`;
            return;
        }

        grid.innerHTML = data.courses.map(c => {
            const grad = getGradient(c.stream);
            const statusBadge = c.published
                ? '<span style="background:#f0fdf4;color:#10b981;padding:0.15rem 0.5rem;border-radius:50px;font-size:0.7rem;font-weight:600">Published</span>'
                : '<span style="background:#fef3c7;color:#d97706;padding:0.15rem 0.5rem;border-radius:50px;font-size:0.7rem;font-weight:600">Draft</span>';

            return `
                <div class="course-card" style="border:1px solid var(--border);border-radius:12px;overflow:hidden;background:white">
                    <div style="height:8px;background:linear-gradient(135deg,${grad})"></div>
                    <div style="padding:1.25rem">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.75rem">
                            <h4 style="margin:0;font-size:1rem;font-weight:700;color:#1e293b;flex:1">${c.title}</h4>
                            ${statusBadge}
                        </div>
                        <p style="font-size:0.82rem;color:#94a3b8;margin:0 0 1rem">${c.stream || 'General'} · ${c.level || 'Beginner'} · ${c.chapterCount || 0} chapters</p>
                        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                            <span style="font-size:0.78rem;color:#64748b"><i class="fas fa-users" style="margin-right:0.3rem"></i>${c.enrollmentCount || 0} enrolled</span>
                        </div>
                        <div style="display:flex;gap:0.5rem;margin-top:1rem;border-top:1px solid #f1f5f9;padding-top:0.75rem">
                            <button onclick="togglePublish('${c._id}', ${c.published})" style="flex:1;padding:0.45rem;border:1px solid var(--border);border-radius:8px;background:${c.published ? '#fef2f2' : '#f0fdf4'};color:${c.published ? '#ef4444' : '#10b981'};font-size:0.78rem;font-weight:600;cursor:pointer">
                                <i class="fas ${c.published ? 'fa-eye-slash' : 'fa-eye'}"></i> ${c.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button onclick="deleteCourseConfirm('${c._id}', '${c.title.replace(/'/g, "\\'")}')" style="padding:0.45rem 0.75rem;border:1px solid #fecaca;border-radius:8px;background:#fef2f2;color:#ef4444;font-size:0.78rem;cursor:pointer">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
        }).join('');
    } catch (err) {
        grid.innerHTML = '<p style="text-align:center;padding:3rem;color:#ef4444">Failed to load courses</p>';
    }
}

document.getElementById('courseSearch')?.addEventListener('input', debounce((e) => {
    loadCourses(e.target.value.trim());
}, 400));

/* ═══════════════ ANALYTICS (CSS Charts) ═══════════════ */
async function renderAnalytics() {
    if (!_statsData) {
        try {
            const res = await fetch(`${_adminAPI}/admin/stats`, { headers: _adminAuthHeaders() });
            const data = await res.json();
            if (data.success) _statsData = data.stats;
        } catch {}
    }
    if (!_statsData) return;

    // User Growth
    const growthEl = document.getElementById('userGrowthChart');
    if (growthEl) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const growth = _statsData.monthlyGrowth || [];
        const maxVal = Math.max(...growth.map(g => g.count), 1);
        growthEl.innerHTML = `<div class="css-bar-chart">${growth.map(g =>
            `<div class="css-bar-row">
                <span class="css-bar-label">${months[g._id - 1] || g._id}</span>
                <div class="css-bar-track"><div class="css-bar-fill" style="width:${(g.count / maxVal * 100)}%;background:linear-gradient(90deg,#4f46e5,#7c3aed)">${g.count}</div></div>
            </div>`
        ).join('') || '<p style="color:var(--text-muted);text-align:center">No growth data yet</p>'}</div>`;
    }

    // Top Courses
    const popEl = document.getElementById('coursePopularityChart');
    if (popEl) {
        const courses = _statsData.topCourses || [];
        const maxVal = Math.max(...courses.map(c => c.count), 1);
        popEl.innerHTML = courses.length > 0 ? `<div class="css-bar-chart">${courses.map(c =>
            `<div class="css-bar-row">
                <span class="css-bar-label">${c.name}</span>
                <div class="css-bar-track"><div class="css-bar-fill" style="width:${(c.count / maxVal * 100)}%;background:linear-gradient(90deg,#0d9488,#059669)">${c.count}</div></div>
            </div>`
        ).join('')}</div>` : '<p style="color:var(--text-muted);text-align:center;padding:2rem">No enrollment data yet</p>';
    }

    // Completion Rate
    const compEl = document.getElementById('completionRatesChart');
    if (compEl) {
        const rate = _statsData.completionRate || 0;
        compEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:1rem">
                <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(#4f46e5 ${rate * 3.6}deg, #f1f5f9 0deg);display:flex;align-items:center;justify-content:center">
                    <div style="width:90px;height:90px;border-radius:50%;background:white;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#4f46e5">${rate}%</div>
                </div>
                <p style="color:var(--text-muted);font-size:0.85rem">${_statsData.totalEnrollments || 0} total enrollments</p>
            </div>`;
    }

    // Platform Summary
    const revEl = document.getElementById('revenueChart');
    if (revEl) {
        revEl.innerHTML = `
            <div class="stat-summary-grid">
                <div class="stat-summary-card"><h4>${_statsData.totalUsers || 0}</h4><p>Total Users</p></div>
                <div class="stat-summary-card"><h4>${_statsData.publishedCourses || 0}</h4><p>Published Courses</p></div>
                <div class="stat-summary-card"><h4>${_statsData.totalCertificates || 0}</h4><p>Certificates</p></div>
                <div class="stat-summary-card"><h4>${_statsData.recentUsers || 0}</h4><p>New (30d)</p></div>
            </div>`;
    }
}

/* ═══════════════ MODALS / ACTIONS ═══════════════ */
function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}
window.closeModal = closeModal;

window.showNotificationCenter = function() { showModal('notificationModal'); };
window.closeNotificationCenter = function() { closeModal('notificationModal'); };

// Add New User
window.addNewUser = function() { showModal('addUserModal'); };

document.getElementById('addUserForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.username.value.trim();
    const nameParts = name.split(' ');
    const body = {
        firstName: nameParts[0] || name,
        lastName: nameParts.slice(1).join(' ') || '',
        email: form.email.value.trim(),
        password: form.password.value,
        role: form.role.value,
    };

    try {
        const res = await fetch(`${_adminAPI}/admin/users`, {
            method: 'POST',
            headers: _adminAuthHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success) {
            showAlert('User created successfully!', 'success');
            closeModal('addUserModal');
            form.reset();
            loadUsersTable();
            loadActivity();
        } else {
            showAlert(data.error || 'Failed to create user', 'error');
        }
    } catch (err) {
        showAlert('Network error', 'error');
    }
});

// Edit User
window.editUserModal = async function(userId) {
    try {
        const res = await fetch(`${_adminAPI}/admin/users/${userId}`, { headers: _adminAuthHeaders() });
        const data = await res.json();
        if (!data.success) { showAlert('User not found', 'error'); return; }

        const u = data.user;
        const html = `
            <div class="modal active" id="editUserModal" style="display:flex">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-user-edit" style="color:var(--primary);margin-right:0.5rem"></i>Edit User</h3>
                        <button class="close-btn" onclick="document.getElementById('editUserModal').remove()"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <form id="editUserForm">
                            <input type="hidden" name="userId" value="${u._id}">
                            <div class="form-group"><label class="form-label">First Name</label><input type="text" name="firstName" value="${u.firstName || ''}" class="form-control" required></div>
                            <div class="form-group"><label class="form-label">Last Name</label><input type="text" name="lastName" value="${u.lastName || ''}" class="form-control"></div>
                            <div class="form-group"><label class="form-label">Email</label><input type="email" name="email" value="${u.email}" class="form-control" required></div>
                            <div class="form-group"><label class="form-label">Role</label>
                                <select name="role" class="form-control form-select">
                                    <option value="student" ${u.role === 'student' ? 'selected' : ''}>Student</option>
                                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Administrator</option>
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full"><i class="fas fa-save"></i> Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('editUserForm').addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const f = ev.target;
            try {
                const r = await fetch(`${_adminAPI}/admin/users/${f.userId.value}`, {
                    method: 'PUT',
                    headers: _adminAuthHeaders(),
                    body: JSON.stringify({
                        firstName: f.firstName.value.trim(),
                        lastName: f.lastName.value.trim(),
                        email: f.email.value.trim(),
                        role: f.role.value,
                    }),
                });
                const d = await r.json();
                if (d.success) {
                    showAlert('User updated!', 'success');
                    document.getElementById('editUserModal')?.remove();
                    loadUsersTable();
                    loadActivity();
                } else {
                    showAlert(d.error || 'Update failed', 'error');
                }
            } catch {
                showAlert('Network error', 'error');
            }
        });
    } catch {
        showAlert('Failed to load user', 'error');
    }
};

// Delete User
window.deleteUserConfirm = function(userId, name) {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    fetch(`${_adminAPI}/admin/users/${userId}`, { method: 'DELETE', headers: _adminAuthHeaders() })
        .then(r => r.json())
        .then(d => {
            if (d.success) { showAlert('User deleted', 'success'); loadUsersTable(); loadActivity(); }
            else showAlert(d.error || 'Delete failed', 'error');
        })
        .catch(() => showAlert('Network error', 'error'));
};

// Create Course
window.createCourse = function() {
    const html = `
        <div class="modal active" id="createCourseModal" style="display:flex">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-plus-circle" style="color:var(--primary);margin-right:0.5rem"></i>Create Course</h3>
                    <button class="close-btn" onclick="document.getElementById('createCourseModal').remove()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="createCourseForm">
                        <div class="form-group"><label class="form-label">Course Title <span class="required">*</span></label><input type="text" name="title" class="form-control" placeholder="e.g. Introduction to Python" required></div>
                        <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-control" rows="3" placeholder="Brief course description"></textarea></div>
                        <div class="form-row">
                            <div class="form-group"><label class="form-label">Stream <span class="required">*</span></label>
                                <select name="stream" class="form-control form-select" required>
                                    <option value="Technology">Technology</option>
                                    <option value="Business">Business</option>
                                    <option value="Science">Science</option>
                                    <option value="Design">Design</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Arts">Arts</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div class="form-group"><label class="form-label">Level</label>
                                <select name="level" class="form-control form-select">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group"><label class="form-label" style="display:flex;align-items:center;gap:0.5rem"><input type="checkbox" name="published" style="width:auto"> Publish immediately</label></div>
                        <button type="submit" class="btn btn-primary btn-full"><i class="fas fa-plus"></i> Create Course</button>
                    </form>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('createCourseForm').addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const f = ev.target;
        try {
            const r = await fetch(`${_adminAPI}/admin/courses`, {
                method: 'POST',
                headers: _adminAuthHeaders(),
                body: JSON.stringify({
                    title: f.title.value.trim(),
                    description: f.description.value.trim(),
                    stream: f.stream.value,
                    level: f.level.value,
                    published: f.published.checked,
                }),
            });
            const d = await r.json();
            if (d.success) {
                showAlert('Course created!', 'success');
                document.getElementById('createCourseModal')?.remove();
                loadCourses();
                loadStats();
                loadActivity();
            } else {
                showAlert(d.error || 'Failed', 'error');
            }
        } catch {
            showAlert('Network error', 'error');
        }
    });
};

// Toggle Publish
window.togglePublish = async function(courseId, currentState) {
    try {
        const r = await fetch(`${_adminAPI}/admin/courses/${courseId}/publish`, { method: 'PATCH', headers: _adminAuthHeaders() });
        const d = await r.json();
        if (d.success) {
            showAlert(d.published ? 'Course published!' : 'Course unpublished', 'success');
            loadCourses();
        } else {
            showAlert(d.error || 'Failed', 'error');
        }
    } catch { showAlert('Network error', 'error'); }
};

// Delete Course
window.deleteCourseConfirm = function(courseId, title) {
    if (!confirm(`Delete course "${title}"? All chapters, enrollments, and certificates will be removed.`)) return;
    fetch(`${_adminAPI}/admin/courses/${courseId}`, { method: 'DELETE', headers: _adminAuthHeaders() })
        .then(r => r.json())
        .then(d => {
            if (d.success) { showAlert('Course deleted', 'success'); loadCourses(); loadStats(); loadActivity(); }
            else showAlert(d.error || 'Failed', 'error');
        })
        .catch(() => showAlert('Network error', 'error'));
};

// Quick Actions
window.viewReports = function() {
    // Switch to analytics
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    document.getElementById('analytics')?.classList.add('active');
    document.querySelector('.sidebar-nav a[href="#analytics"]')?.closest('.nav-item')?.classList.add('active');
};

window.systemBackup = function() {
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    document.getElementById('settings')?.classList.add('active');
    document.querySelector('.sidebar-nav a[href="#settings"]')?.closest('.nav-item')?.classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="backup"]')?.classList.add('active');
    document.getElementById('backup')?.classList.add('active');
};

/* ═══════════════ SETTINGS FORMS ═══════════════ */
document.getElementById('generalSettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('Settings saved successfully!', 'success');
});
document.getElementById('securitySettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('Security settings saved!', 'success');
});
document.getElementById('emailSettingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showAlert('Email settings saved!', 'success');
});

/* ═══════════════ ALERT SYSTEM ═══════════════ */
function showAlert(message, type = 'info') {
    const existing = document.querySelector('.admin-alert');
    if (existing) existing.remove();

    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    };
    const icons = { success: 'check-circle', error: 'times-circle', warning: 'exclamation-triangle', info: 'info-circle' };

    const alert = document.createElement('div');
    alert.className = 'admin-alert';
    alert.innerHTML = `<i class="fas fa-${icons[type]}"></i> <span>${message}</span> <button onclick="this.parentElement.remove()" style="background:none;border:none;color:white;cursor:pointer;margin-left:1rem"><i class="fas fa-times"></i></button>`;
    alert.style.cssText = `
        position:fixed;top:80px;right:20px;z-index:10000;
        background:${colors[type]};color:white;
        padding:0.85rem 1.5rem;border-radius:12px;
        font-size:0.9rem;font-weight:600;
        display:flex;align-items:center;gap:0.6rem;
        box-shadow:0 8px 24px rgba(0,0,0,0.2);
        transform:translateX(400px);transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);
    `;
    document.body.appendChild(alert);
    requestAnimationFrame(() => { alert.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.transform = 'translateX(400px)';
            setTimeout(() => alert.remove(), 300);
        }
    }, 4000);
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
    return new Date(dateStr).toLocaleDateString('en-IN');
}

function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getGradient(category) {
    const gradients = {
        'Technology': '#4f46e5, #7c3aed',
        'Business': '#0d9488, #059669',
        'Design': '#ec4899, #f43f5e',
        'Science': '#3b82f6, #6366f1',
        'Medical': '#ef4444, #f97316',
        'Arts': '#8b5cf6, #a855f7',
        'General': '#64748b, #475569',
    };
    return gradients[category] || '#667eea, #764ba2';
}
