/**
 * Main JavaScript for Educational Platform
 * Handles navigation, forms, and interactive features
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeForms();
    initializeAnimations();
    initializeProgressBars();
});

/**
 * Initialize Navigation
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Mobile overlay menu (used on most pages)
    const hamburgerMobile = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobilePanel = document.getElementById('mobilePanel');
    const mobileClose = document.getElementById('mobileClose');
    
    if (hamburgerMobile && mobileOverlay && mobilePanel) {
        function closeMobileNav() {
            mobileOverlay.classList.remove('open');
            mobilePanel.classList.remove('open');
            document.body.style.overflow = '';
            document.body.classList.remove('mobile-menu-open');
        }
        
        hamburgerMobile.addEventListener('click', () => {
            mobileOverlay.classList.add('open');
            mobilePanel.classList.add('open');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');
        });
        
        if(mobileClose) mobileClose.addEventListener('click', closeMobileNav);
        
        // Close when clicking outside the panel (on the overlay)
        if(mobileOverlay) mobileOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'mobilePanel' || e.target.closest('#mobilePanel')) return;
            closeMobileNav();
        });
        
        // Close when clicking on a link
        document.querySelectorAll('.nav-mobile-links a').forEach(l => {
            l.addEventListener('click', closeMobileNav);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize Forms
 */
function initializeForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Progress form
    const progressForm = document.getElementById('progressForm');
    if (progressForm) {
        progressForm.addEventListener('submit', handleProgressUpdate);
    }
}

/**
 * Handle Login Form Submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/Project/backend/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showAlert(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handle Registration Form Submission
 */
async function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/Project/backend/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Registration successful! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            showAlert(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Handle Progress Update
 */
async function handleProgressUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    const progress = formData.get('progress');
    
    try {
        const response = await fetch('/Project/backend/api/progress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId, progress })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Progress updated successfully!', 'success');
            updateProgressDisplay(courseId, progress);
        } else {
            showAlert(data.message || 'Failed to update progress', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

/**
 * Show Alert Message
 */
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.textContent = message;
    
    // Insert at the top of the body
    document.body.insertBefore(alert, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

/**
 * Initialize Animations
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.feature-card, .course-card, .card, .scroll-reveal').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
    
    // Floating particles effect
    createFloatingParticles();
}

/**
 * Initialize Progress Bars
 */
function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || 0;
        animateProgressBar(bar, progress);
    });
}

/**
 * Animate Progress Bar
 */
function animateProgressBar(bar, targetProgress) {
    let currentProgress = 0;
    const increment = targetProgress / 50; // 50 steps for smooth animation
    
    const interval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(interval);
        }
        
        bar.style.width = currentProgress + '%';
        bar.textContent = Math.round(currentProgress) + '%';
    }, 20);
}

/**
 * Update Progress Display
 */
function updateProgressDisplay(courseId, progress) {
    const progressBar = document.querySelector(`[data-course-id="${courseId}"] .progress-bar`);
    if (progressBar) {
        progressBar.setAttribute('data-progress', progress);
        animateProgressBar(progressBar, progress);
    }
}

/**
 * Toggle Course Content
 */
function toggleCourseContent(courseId) {
    const content = document.querySelector(`#course-${courseId} .course-content`);
    const toggleBtn = document.querySelector(`#course-${courseId} .toggle-btn`);
    
    if (content && toggleBtn) {
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            content.classList.remove('expanded');
            toggleBtn.textContent = 'Show More';
        } else {
            content.classList.add('expanded');
            toggleBtn.textContent = 'Show Less';
        }
    }
}

/**
 * Generate Certificate
 */
async function generateCertificate(courseId) {
    try {
        const response = await fetch('/Project/backend/api/certificate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Certificate generated successfully!', 'success');
            // Open certificate in new window
            window.open(data.certificateUrl, '_blank');
        } else {
            showAlert(data.message || 'Failed to generate certificate', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
    }
}

/**
 * Search Courses
 */
function searchCourses(query) {
    const courseCards = document.querySelectorAll('.course-card');
    const searchTerm = query.toLowerCase();
    
    courseCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Filter Courses by Category
 */
function filterCourses(category) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Utility Functions
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Create Floating Particles Effect
 */
function createFloatingParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
            pointer-events: none;
            z-index: 1;
        `;
        hero.appendChild(particle);
    }
}

// Add CSS for floating particles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

/**
 * Smooth Scroll to Section
 */
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Add Loading Animation
 */
function showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    element.appendChild(spinner);
}

function hideLoading(element) {
    const spinner = element.querySelector('.spinner');
    if (spinner) {
        spinner.remove();
    }
}

/**
 * Add Counter Animation
 */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(start);
    }, 16);
}

// Export functions for use in other scripts
window.EduPlatform = {
    showAlert,
    searchCourses,
    filterCourses,
    generateCertificate,
    toggleCourseContent,
    updateProgressDisplay,
    smoothScrollTo,
    showLoading,
    hideLoading,
    animateCounter
}; 