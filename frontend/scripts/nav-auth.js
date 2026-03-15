/**
 * PRAGATI — nav-auth.js
 * ──────────────────────
 * Include on EVERY page. Handles:
 *  1. Swapping Login/Start-Free buttons → profile dropdown when logged in
 *  2. Auth-guarding protected pages (redirect to login)
 *  3. Logout from anywhere
 *
 * Pages that do NOT require login:
 *   index, about, contact, browse-paths, login, register
 */
(function () {
    'use strict';

    const TOKEN_KEY = 'pragati_token';
    const USER_KEY  = 'pragati_user';

    function getToken() { return localStorage.getItem(TOKEN_KEY); }
    function getUser()  { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
    function isLoggedIn() { return !!getToken(); }

    /* ── Pages open to everyone (no login needed) ──────────── */
    const PUBLIC_PAGES = [
        'index.html', 'about.html', 'contact.html', 'browse-paths.html',
        'login.html', 'register.html',
    ];

    function currentPage() {
        const path = window.location.pathname;
        const file = path.split('/').pop() || 'index.html';
        return file;
    }

    function isPublicPage() {
        const page = currentPage();
        // Root / also counts as index
        if (page === '' || page === '/') return true;
        return PUBLIC_PAGES.some(p => page.toLowerCase() === p.toLowerCase());
    }

    /* ── Auth guard ────────────────────────────────────────── */
    function enforceAuth() {
        if (isPublicPage()) return;

        if (!isLoggedIn()) {
            const redirect = encodeURIComponent(window.location.href);
            window.location.href = 'login.html?redirect=' + redirect;
            return;
        }

        // Admin dashboard guard
        if (currentPage().toLowerCase() === 'admin-dashboard.html') {
            const user = getUser();
            if (!user || user.role !== 'admin') {
                window.location.href = 'user-dashboard.html';
                return;
            }
        }
    }

    /* ── Logout ────────────────────────────────────────────── */
    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        // Use full pathname to detect if we're inside /pages/ directory
        const inPagesDir = window.location.pathname.includes('/pages/');
        window.location.href = inPagesDir ? 'login.html' : 'pages/login.html';
    }
    window.pragatiLogout = logout;

    /* ── Build profile dropdown HTML ───────────────────────── */
    function buildProfileDropdown(user) {
        const initials = ((user.name || 'U')[0]).toUpperCase();
        const isAdmin = user.role === 'admin';
        const dashUrl = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
        const roleLabel = isAdmin ? 'Admin' : 'Student';
        const roleBg = isAdmin ? 'var(--danger, #ef4444)' : 'var(--primary, #4f46e5)';

        return `
            <div class="nav-profile-wrap" id="navProfileWrap">
                <button class="nav-profile-btn" id="navProfileBtn" aria-label="Profile menu">
                    <span class="nav-avatar" style="background:${isAdmin ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'var(--grad-primary, linear-gradient(135deg,#4f46e5,#0d9488))'}">${initials}</span>
                    <span class="nav-profile-name">${(user.name || 'User').split(' ')[0]}</span>
                    <i class="fas fa-chevron-down nav-profile-arrow"></i>
                </button>
                <div class="nav-profile-dropdown" id="navProfileDropdown">
                    <div class="npd-header">
                        <span class="npd-avatar" style="background:${isAdmin ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'var(--grad-primary, linear-gradient(135deg,#4f46e5,#0d9488))'}">${initials}</span>
                        <div class="npd-info">
                            <strong>${user.name || 'User'}</strong>
                            <span>${user.email || ''}</span>
                            <span class="npd-role" style="background:${roleBg}">${roleLabel}</span>
                        </div>
                    </div>
                    <div class="npd-divider"></div>
                    <a href="${dashUrl}" class="npd-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="${dashUrl}#settings" class="npd-link" onclick="localStorage.setItem('pragati_nav_tab','settings')"><i class="fas fa-user-edit"></i> Edit Profile</a>
                    ${isAdmin ? '<a href="admin-dashboard.html#users" class="npd-link" onclick="localStorage.setItem(\'pragati_nav_tab\',\'users\')"><i class="fas fa-users-cog"></i> Manage Users</a>' : '<a href="user-dashboard.html#certificates" class="npd-link" onclick="localStorage.setItem(\'pragati_nav_tab\',\'certificates\')"><i class="fas fa-certificate"></i> My Certificates</a>'}
                    <a href="courses.html" class="npd-link"><i class="fas fa-book-open"></i> Browse Courses</a>
                    <div class="npd-divider"></div>
                    <button class="npd-link npd-logout" onclick="pragatiLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
                </div>
            </div>`;
    }

    /* ── Mobile profile section ─────────────────────────────── */
    function buildMobileProfileSection(user) {
        const isAdmin = user.role === 'admin';
        const dashUrl = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';

        return `
            <div class="nav-mobile-profile-section">
                <div class="nmp-header">
                    <span class="nmp-avatar" style="background:${isAdmin ? 'linear-gradient(135deg,#ef4444,#f97316)' : 'var(--grad-primary, linear-gradient(135deg,#4f46e5,#0d9488))'}">${((user.name || 'U')[0]).toUpperCase()}</span>
                    <div>
                        <strong>${user.name || 'User'}</strong>
                        <span>${user.email || ''}</span>
                    </div>
                </div>
            </div>
            <a href="${dashUrl}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="${dashUrl}#settings" onclick="localStorage.setItem('pragati_nav_tab','settings')"><i class="fas fa-user-edit"></i> Edit Profile</a>`;
    }

    /* ── Swap nav auth area ────────────────────────────────── */
    function updateNavbar() {
        if (!isLoggedIn()) return; // Keep Login / Start Free buttons as-is

        const user = getUser();
        if (!user) return;

        // Desktop: replace .nav-auth contents
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            navAuth.innerHTML = buildProfileDropdown(user);
            initDropdownToggle();
        }

        // Mobile: replace .nav-mobile-auth contents
        const mobileAuth = document.querySelector('.nav-mobile-auth');
        if (mobileAuth) {
            mobileAuth.innerHTML = `
                <a href="${user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'}" class="nmb-login" style="display:flex;align-items:center;gap:0.5rem">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <button class="nmb-signup" onclick="pragatiLogout()" style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;border:none">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>`;
        }

        // Also update any .nmb-login / .nmb-signup in legacy mobile panels
        const mobileLoginLinks = document.querySelectorAll('.nav-mobile-links');
        mobileLoginLinks.forEach(panel => {
            // Append profile links at bottom of mobile nav
            const existing = panel.querySelector('.mobile-auth-injected');
            if (!existing) {
                const div = document.createElement('div');
                div.className = 'mobile-auth-injected';
                div.style.cssText = 'border-top:1px solid var(--gray-200, #e2e8f0);margin-top:0.5rem;padding-top:0.5rem;';
                div.innerHTML = `
                    <a href="${user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                    <a href="#" onclick="pragatiLogout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
                panel.appendChild(div);
            }
        });
    }

    /* ── Dropdown toggle ───────────────────────────────────── */
    function initDropdownToggle() {
        const btn = document.getElementById('navProfileBtn');
        const dropdown = document.getElementById('navProfileDropdown');
        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
            btn.querySelector('.nav-profile-arrow')?.classList.toggle('open');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navProfileWrap')) {
                dropdown.classList.remove('open');
                btn.querySelector('.nav-profile-arrow')?.classList.remove('open');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('open');
                btn.querySelector('.nav-profile-arrow')?.classList.remove('open');
            }
        });
    }

    /* ── On login / register pages, redirect if already logged in ─ */
    function redirectIfLoggedIn() {
        const page = currentPage().toLowerCase();
        if ((page === 'login.html' || page === 'register.html') && isLoggedIn()) {
            const user = getUser();
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get('redirect');
            if (redirect) {
                window.location.href = redirect;
            } else if (user?.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        }
    }

    /* ── Boot ──────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    function boot() {
        enforceAuth();
        updateNavbar();
        redirectIfLoggedIn();
    }

    // Expose refresh for profile updates
    window._navAuthRefresh = function() { updateNavbar(); };

})();
