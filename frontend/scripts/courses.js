/**
 * PRAGATI — Courses Page Script
 * ──────────────────────────────
 * Dynamically loads courses from the API.
 * Falls back to static content if API unavailable.
 */
'use strict';

const API_BASE = window.location.origin + '/api/v1';
let allCourses = [];
let currentFilter = 'All';

(async function init() {
    try {
        const res = await fetch(`${API_BASE}/courses`);
        const data = await res.json();
        if (data.success && data.courses.length > 0) {
            allCourses = data.courses;
            renderDynamicCourses(allCourses);
            setupDynamicFilters();
            setupDynamicSearch();
        }
    } catch (err) {
        // API not available — keep the static HTML cards visible
        console.log('API not available, showing static course cards.');
    }
})();

function renderDynamicCourses(courses) {
    const grid = document.querySelector('.courses-grid');
    if (!grid) return;

    grid.innerHTML = courses.map((c, i) => `
        <div class="course-card reveal visible" style="--delay:${(i % 6) * 0.08}s" data-category="${c.category || ''}" data-slug="${c.slug}">
            <div class="cc-image" style="background: linear-gradient(135deg, ${getCategoryGradient(c.category)});">
                <span class="cc-icon-overlay">${c.icon || '📖'}</span>
                ${c.isFeatured ? '<span class="cc-badge">Featured</span>' : ''}
            </div>
            <div class="cc-body">
                <div class="cc-provider">${c.degree.toUpperCase()} · ${c.stream.toUpperCase()}</div>
                <div class="cc-title">${c.title}</div>
                <div class="cc-desc">${(c.description || '').substring(0, 100)}${c.description && c.description.length > 100 ? '...' : ''}</div>
                <div class="cc-meta">
                    <span><i class="fas fa-clock"></i> ${c.estimatedHours || '—'} hrs</span>
                    <span><i class="fas fa-layer-group"></i> ${c.totalChapters} chapters</span>
                    <span><i class="fas fa-signal"></i> ${capitalize(c.difficulty)}</span>
                </div>
                <div class="cc-footer">
                    <span class="cc-rating"><i class="fas fa-star"></i> ${c.rating || '—'} <span class="count">(${formatCount(c.ratingCount)})</span></span>
                    <a href="course-detail.html?slug=${c.slug}" class="cc-start-btn">
                        Start Learning <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');

    // Make cards clickable
    grid.querySelectorAll('.course-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.cc-start-btn')) return;
            const slug = card.dataset.slug;
            window.location.href = `course-detail.html?slug=${slug}`;
        });
    });

    // Hide load more button when showing API data
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

function setupDynamicFilters() {
    const filterBtns = document.querySelectorAll('.sfb-filter');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.innerText.trim();
            applyFilters();
        });
    });
}

function setupDynamicSearch() {
    const searchInput = document.getElementById('courseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => applyFilters());
    }
}

function applyFilters() {
    const searchTerm = (document.getElementById('courseSearch')?.value || '').toLowerCase();
    const filtered = allCourses.filter(c => {
        const matchSearch = !searchTerm
            || c.title.toLowerCase().includes(searchTerm)
            || (c.description || '').toLowerCase().includes(searchTerm)
            || (c.tags || []).some(t => t.toLowerCase().includes(searchTerm));

        const matchFilter = currentFilter === 'All Courses'
            || currentFilter === 'All'
            || currentFilter === 'Free'
            || c.category === currentFilter;

        return matchSearch && matchFilter;
    });
    renderDynamicCourses(filtered);
}

function getCategoryGradient(category) {
    const gradients = {
        'Technology': '#4f46e5, #7c3aed',
        'Business': '#0d9488, #059669',
        'Design': '#ec4899, #f43f5e',
        'Science': '#3b82f6, #6366f1',
        'Medical': '#ef4444, #f97316',
    };
    return gradients[category] || '#4f46e5, #0d9488';
}

function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
function formatCount(n) {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return n.toString();
}
