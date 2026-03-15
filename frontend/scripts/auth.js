/* ================================================================
   PRAGATI — auth.js
   Complete Login / Register / Logout system with real API
   ================================================================ */

'use strict';

const API_BASE = window.location.origin + '/api/v1';

/* ── Helpers ──────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const setError = (fieldId, errId, msg) => {
    const f = $(fieldId);
    const e = $(errId);
    if (!f) return;
    if (msg) {
        f.classList.add('error'); f.classList.remove('success');
        if (e) e.textContent = msg;
    } else {
        f.classList.remove('error'); f.classList.add('success');
        if (e) e.textContent = '';
    }
};
const clearField = (fieldId, errId) => {
    const f = $(fieldId);
    const e = $(errId);
    if (f) { f.classList.remove('error', 'success'); }
    if (e) { e.textContent = ''; }
};

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ── Token Storage ───────────────────────────────────────────── */
const AUTH_KEY = 'pragati_token';
const USER_KEY = 'pragati_user';

function saveAuth(token, user) {
    localStorage.setItem(AUTH_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getToken() { return localStorage.getItem(AUTH_KEY); }
function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
}

function isLoggedIn() { return !!getToken(); }

/* ── Redirect helpers ─────────────────────────────────────────── */
function redirectByRole(user) {
    if (user && user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
    } else {
        window.location.href = 'user-dashboard.html';
    }
}

function getRedirectUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('redirect') || null;
}

/* ── Password toggle ──────────────────────────────────────────── */
function initPasswordToggle(toggleId, inputId, iconId) {
    const btn  = $(toggleId);
    const inp  = $(inputId);
    const icon = $(iconId);
    if (!btn || !inp) return;
    btn.addEventListener('click', () => {
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        if (icon) {
            icon.className = show ? 'fas fa-eye-slash' : 'fas fa-eye';
        }
    });
}

/* ── Password strength ────────────────────────────────────────── */
function initPasswordStrength(inputId, fillId, labelId) {
    const inp   = $(inputId);
    const fill  = $(fillId);
    const label = $(labelId);
    if (!inp || !fill || !label) return;

    inp.addEventListener('input', () => {
        const v   = inp.value;
        let score = 0;
        if (v.length >= 8)  score++;
        if (v.length >= 12) score++;
        if (/[A-Z]/.test(v)) score++;
        if (/[0-9]/.test(v)) score++;
        if (/[^A-Za-z0-9]/.test(v)) score++;

        const idx = Math.min(score, 4);
        const lvl = [
            { pct: 0,   color: '#e2e8f0', text: 'Enter a password' },
            { pct: 25,  color: '#ef4444', text: 'Too weak' },
            { pct: 50,  color: '#f97316', text: 'Fair' },
            { pct: 75,  color: '#eab308', text: 'Good' },
            { pct: 100, color: '#10b981', text: 'Strong 💪' },
        ][idx];

        fill.style.width    = (v.length ? lvl.pct : 0) + '%';
        fill.style.background = lvl.color;
        label.textContent  = v.length ? lvl.text : 'Enter a password';
        label.style.color  = lvl.color;
    });
}

/* ── Loading state ────────────────────────────────────────────── */
function setLoading(btnId, loading) {
    const btn = $(btnId);
    if (!btn) return;
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    btn.disabled = loading;
    if (text)   text.style.display   = loading ? 'none' : '';
    if (loader) loader.style.display = loading ? '' : 'none';
}

/* ── Show toast notification ──────────────────────────────────── */
function showToast(message, type = 'info') {
    const existing = document.querySelector('.auth-toast');
    if (existing) existing.remove();

    const colors = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        info: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    };

    const toast = document.createElement('div');
    toast.className = 'auth-toast';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    toast.style.cssText = `
        position: fixed; top: 80px; right: 20px; z-index: 10000;
        background: ${colors[type]}; color: white;
        padding: 0.85rem 1.5rem; border-radius: 12px;
        font-size: 0.9rem; font-weight: 600;
        display: flex; align-items: center; gap: 0.6rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        transform: translateX(400px); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════════ */
function initLogin() {
    const form = $('loginForm');
    if (!form) return;

    // If already logged in, redirect
    if (isLoggedIn()) {
        const user = getUser();
        redirectByRole(user);
        return;
    }

    initPasswordToggle('pwToggle', 'password', 'pwIcon');

    // Live validation
    $('email')?.addEventListener('blur', () => {
        const v = $('email').value.trim();
        if (!v) setError('email', 'emailErr', 'Email is required');
        else if (!isEmail(v)) setError('email', 'emailErr', 'Enter a valid email address');
        else setError('email', 'emailErr', null);
    });
    $('email')?.addEventListener('input', () => clearField('email', 'emailErr'));
    $('password')?.addEventListener('input', () => clearField('password', 'passwordErr'));

    // Google button
    $('googleBtn')?.addEventListener('click', () => {
        showToast('Google OAuth will be available soon!', 'info');
    });

    // Form submit → REAL API
    form.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;

        const email = $('email').value.trim();
        const pass  = $('password').value;

        if (!email) { setError('email', 'emailErr', 'Email is required'); valid = false; }
        else if (!isEmail(email)) { setError('email', 'emailErr', 'Enter a valid email'); valid = false; }

        if (!pass) { setError('password', 'passwordErr', 'Password is required'); valid = false; }
        else if (pass.length < 6) { setError('password', 'passwordErr', 'Password must be at least 6 characters'); valid = false; }

        if (!valid) {
            $('authCard')?.classList.add('shake');
            setTimeout(() => $('authCard')?.classList.remove('shake'), 400);
            return;
        }

        setLoading('loginBtn', true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass }),
            });
            const data = await res.json();

            if (data.success) {
                saveAuth(data.token, data.user);

                $('authCard')?.classList.add('success-pulse');
                $('loginBtn').innerHTML = '<span class="btn-text"><i class="fas fa-check"></i> Signed In!</span>';
                $('loginBtn').style.background = 'linear-gradient(135deg,#10b981,#059669)';

                showToast(`Welcome back, ${data.user.name}!`, 'success');

                setTimeout(() => {
                    const redirect = getRedirectUrl();
                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        redirectByRole(data.user);
                    }
                }, 800);
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (err) {
            setLoading('loginBtn', false);
            showToast(err.message || 'Login failed. Please try again.', 'error');
            
            // Highlight relevant field
            if (err.message.toLowerCase().includes('credential')) {
                setError('password', 'passwordErr', 'Invalid email or password');
            }
            $('authCard')?.classList.add('shake');
            setTimeout(() => $('authCard')?.classList.remove('shake'), 400);
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════════════════ */
function initRegister() {
    const form = $('registerForm');
    if (!form) return;

    // If already logged in, redirect
    if (isLoggedIn()) {
        const user = getUser();
        redirectByRole(user);
        return;
    }

    initPasswordToggle('pwToggle', 'password', 'pwIcon');
    initPasswordStrength('password', 'pwFill', 'pwLabel');

    // Google button
    $('googleBtn')?.addEventListener('click', () => {
        showToast('Google OAuth will be available soon!', 'info');
    });

    // Live clear on input
    ['fname','lname','email','password'].forEach(id => {
        $(id)?.addEventListener('input', () => clearField(id, id + 'Err'));
    });
    $('eduLevel')?.addEventListener('change', () => clearField('eduLevel', 'eduErr'));

    // Form submit → REAL API
    form.addEventListener('submit', async e => {
        e.preventDefault();
        let valid = true;

        const fname = $('fname')?.value.trim();
        const lname = $('lname')?.value.trim();
        const email = $('email')?.value.trim();
        const edu   = $('eduLevel')?.value;
        const pass  = $('password')?.value;
        const terms = $('terms')?.checked;

        if (!fname) { setError('fname', 'fnameErr', 'First name is required'); valid = false; }
        if (!lname) { setError('lname', 'lnameErr', 'Last name is required'); valid = false; }
        if (!email) { setError('email', 'emailErr', 'Email is required'); valid = false; }
        else if (!isEmail(email)) { setError('email', 'emailErr', 'Enter a valid email'); valid = false; }
        if (!edu)  { setError('eduLevel', 'eduErr', 'Please select your education level'); valid = false; }
        if (!pass) { setError('password', 'passwordErr', 'Password is required'); valid = false; }
        else if (pass.length < 6) { setError('password', 'passwordErr', 'Password must be at least 6 characters'); valid = false; }
        if (!terms) {
            showToast('Please agree to the Terms of Service to continue.', 'error');
            valid = false;
        }

        if (!valid) {
            $('authCard')?.classList.add('shake');
            setTimeout(() => $('authCard')?.classList.remove('shake'), 400);
            return;
        }

        setLoading('registerBtn', true);

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: fname,
                    lastName: lname,
                    email,
                    password: pass,
                    eduLevel: edu,
                }),
            });
            const data = await res.json();

            if (data.success) {
                saveAuth(data.token, data.user);

                $('authCard')?.classList.add('success-pulse');
                $('registerBtn').innerHTML = '<span class="btn-text"><i class="fas fa-check"></i> Account Created!</span>';
                $('registerBtn').style.background = 'linear-gradient(135deg,#10b981,#059669)';

                showToast(`Welcome to Pragati, ${data.user.name}!`, 'success');

                setTimeout(() => {
                    const redirect = getRedirectUrl();
                    if (redirect) {
                        window.location.href = redirect;
                    } else {
                        redirectByRole(data.user);
                    }
                }, 900);
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (err) {
            setLoading('registerBtn', false);
            showToast(err.message || 'Registration failed.', 'error');

            if (err.message.toLowerCase().includes('email')) {
                setError('email', 'emailErr', err.message);
            }
            $('authCard')?.classList.add('shake');
            setTimeout(() => $('authCard')?.classList.remove('shake'), 400);
        }
    });
}

/* ═══════════════════════════════════════════════════════════════
   LOGOUT — callable from any page
   ═══════════════════════════════════════════════════════════════ */
window.pragatiLogout = function () {
    clearAuth();
    showToast('You have been logged out.', 'info');
    setTimeout(() => {
        window.location.href = window.location.pathname.includes('pages/') ? 'login.html' : 'pages/login.html';
    }, 600);
};

/* ═══════════════════════════════════════════════════════════════
   NAVBAR AUTH STATE — updates any page's navbar based on login
   ═══════════════════════════════════════════════════════════════ */
function updateNavbarAuthState() {
    const user = getUser();
    const loggedIn = isLoggedIn();

    // Find all logout buttons
    document.querySelectorAll('#logoutBtn, .logout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            pragatiLogout();
        });
    });

    // Update auth nav links in navbar
    const authLinks = document.querySelector('.nav-auth-links');
    if (authLinks) {
        if (loggedIn && user) {
            authLinks.innerHTML = `
                <a href="${user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'}" class="nav-link">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="#" class="nav-link logout-btn" onclick="pragatiLogout(); return false;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            `;
        }
    }

    // Update welcome names on dashboards
    const welcomeEl = $('welcomeName');
    if (welcomeEl && user) {
        welcomeEl.textContent = user.name?.split(' ')[0] || 'Student';
    }

    const userNameEl = $('userName');
    if (userNameEl && user) {
        userNameEl.textContent = user.name || 'Student';
    }

    const userEmailEl = $('userEmail');
    if (userEmailEl && user) {
        userEmailEl.textContent = user.email || '';
    }

    const adminNameEl = $('adminName');
    if (adminNameEl && user) {
        adminNameEl.textContent = user.name || 'Admin';
    }

    const adminEmailEl = $('adminEmail');
    if (adminEmailEl && user) {
        adminEmailEl.textContent = user.email || '';
    }
}

/* ═══════════════════════════════════════════════════════════════
   AUTH GUARD — protect dashboard pages
   ═══════════════════════════════════════════════════════════════ */
function guardPage(requiredRole) {
    if (!isLoggedIn()) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    const user = getUser();
    if (requiredRole && user?.role !== requiredRole) {
        showToast('Access denied. Insufficient permissions.', 'error');
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
        return false;
    }
    return true;
}

/* ── Export globally ──────────────────────────────────────────── */
window.PragatiAuth = {
    getToken,
    getUser,
    isLoggedIn,
    clearAuth,
    saveAuth,
    guardPage,
    showToast,
    API_BASE,
    authHeaders: () => {
        const token = getToken();
        return token
            ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            : { 'Content-Type': 'application/json' };
    },
};

/* ── Boot ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initRegister();
    updateNavbarAuthState();
});
