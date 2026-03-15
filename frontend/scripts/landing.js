/**
 * PRAGATI — Landing Page JavaScript
 */

/* ── Navbar scroll ──────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    scrollTopBtn?.classList.toggle('show', window.scrollY > 400);
});
scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Mobile menu ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobilePanel = document.getElementById('mobilePanel');
const mobileClose = document.getElementById('mobileClose');

function closeMobileNav() {
    if(!mobileOverlay) return;
    mobileOverlay.classList.remove('open');
    mobilePanel.classList.remove('open');
    document.body.style.overflow = '';
    document.body.classList.remove('mobile-menu-open');
}

hamburger?.addEventListener('click', () => {
    mobileOverlay.classList.add('open');
    mobilePanel.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('mobile-menu-open');
});

if(mobileClose) mobileClose.addEventListener('click', closeMobileNav);
if(mobileOverlay) mobileOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'mobilePanel' || e.target.closest('#mobilePanel')) return;
    closeMobileNav();
});

document.querySelectorAll('.nav-mobile-links a').forEach(l => l.addEventListener('click', closeMobileNav));

/* ── Scroll Reveal ──────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ── Counter Animation ──────────────────────────────────────── */
function animateCounter(el, target, suffix) {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        const val = target >= 1000
            ? Math.floor(current).toLocaleString('en-IN')
            : Math.floor(current);
        el.textContent = val;
        if (current >= target) clearInterval(timer);
    }, 16);
}
const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll('.stat-num').forEach(el => {
            const target = parseInt(el.dataset.to, 10);
            if (!isNaN(target)) animateCounter(el, target);
        });
        statsObs.unobserve(e.target);
    });
}, { threshold: 0.5 });
document.querySelector('.stats-inner') && statsObs.observe(document.querySelector('.stats-inner'));

/* ── Quick Explore Path Data ────────────────────────────────── */
const qexPaths = {
    science: [
        { icon:'⚙️', iconBg:'linear-gradient(135deg,#818cf8,#4f46e5)', name:'B.Tech / B.E.', full:'Bachelor of Technology', desc:'Engineering across CS, ECE, Mech, Civil, Chem and more. Top MNC placements.', duration:'4 yrs', type:'UG Degree', salary:'₹4L–₹18L' },
        { icon:'🔬', iconBg:'linear-gradient(135deg,#34d399,#0d9488)', name:'B.Sc Science', full:'Bachelor of Science', desc:'Pure science in Physics, Chemistry, Maths or Biology. Gateway to research & GATE.', duration:'3 yrs', type:'UG Degree', salary:'₹3L–₹10L' },
        { icon:'🏥', iconBg:'linear-gradient(135deg,#f472b6,#ec4899)', name:'MBBS / BDS', full:'Medical / Dental Science', desc:'Premier medical degrees. Requires NEET UG. Opens path to being a doctor.', duration:'5.5 yrs', type:'UG Degree', salary:'₹8L–₹50L+' },
        { icon:'🏗️', iconBg:'linear-gradient(135deg,#60a5fa,#3b82f6)', name:'B.Arch', full:'Bachelor of Architecture', desc:'Design and engineering combined. 5-year creative technical degree.', duration:'5 yrs', type:'UG Degree', salary:'₹4L–₹15L' },
    ],
    commerce: [
        { icon:'📋', iconBg:'linear-gradient(135deg,#fbbf24,#f59e0b)', name:'CA (ICAI)', full:'Chartered Accountancy', desc:'Top finance career. 3-stage exam over ~4.5 years. Highest salary in commerce.', duration:'4.5 yrs', type:'Professional', salary:'₹7L–₹50L+' },
        { icon:'📊', iconBg:'linear-gradient(135deg,#34d399,#10b981)', name:'B.Com (Hons)', full:'Bachelor of Commerce', desc:'Foundation commerce degree. Best with CA, MBA, CFA. DU SRCC, Loyola.', duration:'3 yrs', type:'UG Degree', salary:'₹3L–₹9L' },
        { icon:'💼', iconBg:'linear-gradient(135deg,#818cf8,#4f46e5)', name:'BBA / BMS', full:'Bachelor of Business Administration', desc:'Management gateway. IIM Indore IPM, Symbiosis, NMIMS. MBA ready.', duration:'3 yrs', type:'UG Degree', salary:'₹3L–₹10L' },
        { icon:'📈', iconBg:'linear-gradient(135deg,#fb923c,#ef4444)', name:'B.Sc Economics', full:'Bachelor of Science Economics', desc:'Quantitative economics. DSE, JNU. Great for RBI, UPSC, investment banking.', duration:'3 yrs', type:'UG Degree', salary:'₹3.5L–₹12L' },
    ],
    arts: [
        { icon:'⚖️', iconBg:'linear-gradient(135deg,#a78bfa,#7c3aed)', name:'LLB / BA LLB', full:'Bachelor of Laws', desc:'Law career in litigation, corporate, civil services or judiciary. CLAT for NLUs.', duration:'3–5 yrs', type:'Professional', salary:'₹4L–₹30L+' },
        { icon:'🎨', iconBg:'linear-gradient(135deg,#f472b6,#ec4899)', name:'BFA / B.Des', full:'Bachelor of Fine Arts / Design', desc:'NID, NIFT, UCEED for product, graphic, UI/UX, fashion design careers.', duration:'4 yrs', type:'UG Degree', salary:'₹3L–₹20L' },
        { icon:'📰', iconBg:'linear-gradient(135deg,#34d399,#0d9488)', name:'BJMC', full:'Mass Communication & Journalism', desc:'IIMC, ACJ. Journalism, PR, digital media, film-making and content creation.', duration:'3 yrs', type:'UG Degree', salary:'₹3L–₹12L' },
        { icon:'🏛️', iconBg:'linear-gradient(135deg,#60a5fa,#4f46e5)', name:'UPSC Pathway', full:'B.A. + Civil Services', desc:'Arts gives advantage in UPSC with History, Polity, Sociology overlap. IAS/IPS/IFS.', duration:'3+2 yrs', type:'Govt Exam', salary:'₹6L–₹14L(govt)' },
    ],
    diploma: [
        { icon:'🔧', iconBg:'linear-gradient(135deg,#60a5fa,#3b82f6)', name:'Lateral B.Tech', full:'Direct 2nd Year Entry', desc:'Diploma holders skip 1st year of B.Tech via lateral entry. Smart & fast path.', duration:'3 yrs', type:'UG Lateral', salary:'₹4L–₹18L' },
        { icon:'💊', iconBg:'linear-gradient(135deg,#f472b6,#ec4899)', name:'D.Pharm / B.Pharm', full:'Diploma / Bachelor of Pharmacy', desc:'2 or 4 year pharmacy programs. Drug industry, hospital pharmacy, research.', duration:'2–4 yrs', type:'Diploma/Degree', salary:'₹2.5L–₹10L' },
        { icon:'🍳', iconBg:'linear-gradient(135deg,#fbbf24,#f59e0b)', name:'Hotel Management', full:'DHMCT / BHMCT', desc:'IHM Pusa, WGSHA. Front-office, food & bev, culinary arts. Global career.', duration:'3 yrs', type:'Diploma/Degree', salary:'₹3L–₹15L' },
        { icon:'🎬', iconBg:'linear-gradient(135deg,#a78bfa,#7c3aed)', name:'Animation / VFX', full:'Diploma in Animation & Media', desc:'Arena, MAAC, FTII. Game design, VFX, 3D modeling, digital content creation.', duration:'2–3 yrs', type:'Diploma', salary:'₹3L–₹20L' },
    ],
    graduation: [
        { icon:'⚙️', iconBg:'linear-gradient(135deg,#818cf8,#4f46e5)', name:'M.Tech / ME', full:'Master of Technology', desc:'GATE score for IIT/NIT admission + stipend. Specialize and go into R&D.', duration:'2 yrs', type:'PG Degree', salary:'₹8L–₹30L' },
        { icon:'💼', iconBg:'linear-gradient(135deg,#fbbf24,#f59e0b)', name:'MBA', full:'Master of Business Administration', desc:'IIMs, XLRI, FMS via CAT. Career jump to product, consulting, entrepreneurship.', duration:'2 yrs', type:'PG Degree', salary:'₹15L–₹80L+' },
        { icon:'🌍', iconBg:'linear-gradient(135deg,#34d399,#0d9488)', name:'MS Abroad', full:'Masters Abroad – USA/Germany/Canada', desc:'GRE + TOEFL. MIT, Stanford, TU Munich. Work visa post-study offer.', duration:'1.5–2 yrs', type:'PG Abroad', salary:'₹25L–₹1Cr+' },
        { icon:'🔬', iconBg:'linear-gradient(135deg,#f472b6,#ec4899)', name:'PhD / Research', full:'Doctor of Philosophy', desc:'UGC-NET / GATE for fellowships. Academic career, DRDO, CSIR, IISc research.', duration:'3–5 yrs', type:'Research Degree', salary:'₹6L–₹25L' },
    ],
};

const qexGrid = document.getElementById('qexGrid');

function renderQex(stream) {
    if (!qexGrid) return;
    const paths = qexPaths[stream] || [];
    qexGrid.innerHTML = '';
    paths.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'qex-path-card';
        card.style.animationDelay = (i * 0.07) + 's';
        card.innerHTML = `
            <div class="qex-card-top">
                <div class="qex-card-icon" style="background:${p.iconBg}">${p.icon}</div>
                <div><div class="qex-card-name">${p.name}</div><div class="qex-card-full">${p.full}</div></div>
            </div>
            <div class="qex-card-desc">${p.desc}</div>
            <div class="qex-card-meta">
                <span class="qex-meta-item"><i class="fas fa-clock"></i> ${p.duration}</span>
                <span class="qex-meta-item"><i class="fas fa-certificate"></i> ${p.type}</span>
            </div>
            <div class="qex-card-footer">
                <span class="qex-salary"><i class="fas fa-rupee-sign"></i> ${p.salary}/yr</span>
                <span class="qex-more-btn">Details <i class="fas fa-arrow-right"></i></span>
            </div>
        `;
        card.addEventListener('click', () => window.location.href = 'explore.html');
        qexGrid.appendChild(card);
    });
}

document.querySelectorAll('.qex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.qex-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderQex(tab.dataset.tab);
    });
});
renderQex('science');

/* ── Testimonials ───────────────────────────────────────────── */
const testimonials = [
    { text:'I had no idea what to do after PCB. Pragati showed me MBBS, BDS, nursing and biotech — now I\'m in BPT and loving it!', name:'Priya Sharma', path:'PCB → BPT, 2nd Year', initials:'PS', color:'#ec4899', stars:5 },
    { text:'The PCM path explorer was incredible. It showed me Merchant Navy as an option I never knew existed. Changed my life!', name:'Rahul Verma', path:'PCM → Merchant Navy Officer', initials:'RV', color:'#4f46e5', stars:5 },
    { text:'As a commerce student, I was unsure between CA and MBA. Pragati\'s path detail helped me pick CA Foundation first.', name:'Anjali Patel', path:'Commerce → CA Foundation', initials:'AP', color:'#0d9488', stars:5 },
    { text:'After my diploma in electronics, I joined B.Tech 2nd year via lateral entry. Pragati\'s guide made this clear.', name:'Kiran Mehta', path:'Diploma → B.Tech Lateral Entry', initials:'KM', color:'#f59e0b', stars:5 },
    { text:'Even for post-graduation options after B.Sc, Pragati had complete info on GATE, IISc, and abroad MS pathways.', name:'Suresh Nair', path:'B.Sc Physics → M.Tech (GATE)', initials:'SN', color:'#7c3aed', stars:5 },
    { text:'Arts student here. I was confused between law and journalism. The career comparison feature helped me choose BJMC.', name:'Meera Joshi', path:'Arts → BJMC, IIMC Delhi', initials:'MJ', color:'#14b8a6', stars:5 },
];

function renderTestimonials() {
    const grid = document.getElementById('testiGrid');
    const dots = document.getElementById('testiDots');
    if (!grid || !dots) return;

    const perPage = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
    let page = 0;
    const pages = Math.ceil(testimonials.length / perPage);

    function render() {
        const start = page * perPage;
        const slice = testimonials.slice(start, start + perPage);
        grid.style.grid = `auto / repeat(${perPage}, 1fr)`;
        grid.innerHTML = slice.map(t => `
            <div class="testi-card">
                <div class="testi-stars">${'★'.repeat(t.stars)}</div>
                <div class="testi-text">${t.text}</div>
                <div class="testi-author">
                    <div class="testi-avatar" style="background:${t.color}">${t.initials}</div>
                    <div><div class="testi-name">${t.name}</div><div class="testi-path">${t.path}</div></div>
                </div>
            </div>
        `).join('');

        dots.innerHTML = Array.from({length: pages}, (_, i) =>
            `<button class="testi-dot ${i===page?'active':''}" data-i="${i}"></button>`
        ).join('');
        dots.querySelectorAll('.testi-dot').forEach(d => d.addEventListener('click', () => { page = parseInt(d.dataset.i); render(); }));
    }
    render();
    let auto = setInterval(() => { page = (page + 1) % pages; render(); }, 5000);
    grid.addEventListener('mouseenter', () => clearInterval(auto));
    grid.addEventListener('mouseleave', () => { auto = setInterval(() => { page = (page + 1) % pages; render(); }, 5000); });
    window.addEventListener('resize', () => render());
}
renderTestimonials();

/* ── Active nav link (stable, page-based ─ never removed on scroll) ── */
(function () {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = (link.getAttribute('href') || '').split('?')[0];
        if (href && href !== '#' && currentPath === href) {
            link.classList.add('active');
        }
    });
})();
