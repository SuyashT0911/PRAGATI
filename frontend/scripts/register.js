/**
 * Register Page JavaScript
 * Handles registration logic and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeRegisterPage();
});

function initializeRegisterPage() {
    // Show/hide admin code field
    const roleSelect = document.getElementById('role');
    const adminCodeGroup = document.getElementById('adminCodeGroup');
    if (roleSelect && adminCodeGroup) {
        roleSelect.addEventListener('change', function() {
            if (this.value === 'admin') {
                adminCodeGroup.style.display = '';
            } else {
                adminCodeGroup.style.display = 'none';
            }
        });
    }

    // Form validation and submission
    const form = document.getElementById('registerForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validateRegisterForm(form)) {
                await handleRegisterSubmission(form);
            }
        });
    }
}

function validateRegisterForm(form) {
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const role = form.role.value;
    const adminCode = form.adminCode ? form.adminCode.value.trim() : '';

    if (!username || username.length < 3) {
        showAlert('Username must be at least 3 characters', 'error');
        return false;
    }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        showAlert('Enter a valid email address', 'error');
        return false;
    }
    if (!password || password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return false;
    }
    if (role === 'admin' && adminCode !== 'EDUADMIN2024') {
        showAlert('Invalid admin registration code', 'error');
        return false;
    }
    return true;
}

async function handleRegisterSubmission(form) {
    const submitBtn = form.querySelector('.login-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    submitBtn.disabled = true;
    btnText.textContent = 'Registering...';
    btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    // Simulate API call
    setTimeout(() => {
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        btnText.textContent = 'Success!';
        btnIcon.innerHTML = '<i class="fas fa-check"></i>';

        // Store user data in localStorage
        const user = {
            id: Date.now(),
            username: form.username.value.trim(),
            email: form.email.value.trim(),
            role: form.role.value
        };
        localStorage.setItem('userData', JSON.stringify(user));

        // Redirect based on role
        setTimeout(() => {
            window.location.href = user.role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        }, 1500);
    }, 1500);
} 