/**
 * ═══════════════════════════════════════════════════
 *  PRAGATI — Path Explorer JavaScript
 *  Dynamic education path suggestion engine
 * ═══════════════════════════════════════════════════
 */

/* ─── Stream Options per Education Level ─────────────────── */
const streamOptions = {
    '10th': [
        { id: 'any', label: 'Any / General', icon: '📚', cls: 'gen' }
    ],
    '12th': [
        { id: 'pcm',     label: 'PCM (Phy+Chem+Maths)',   icon: '⚙️', cls: 'sci' },
        { id: 'pcb',     label: 'PCB (Phy+Chem+Bio)',      icon: '🧬', cls: 'sci' },
        { id: 'pcmb',    label: 'PCMB (All 4)',            icon: '🔭', cls: 'sci' },
        { id: 'commerce','label': 'Commerce',               icon: '📊', cls: 'com' },
        { id: 'arts',    label: 'Humanities / Arts',        icon: '🎨', cls: 'art' },
        { id: 'vocational','label':'Vocational',            icon: '🔧', cls: 'dip' },
    ],
    'diploma': [
        { id: 'engdip',   label: 'Engineering Diploma',    icon: '⚙️', cls: 'dip' },
        { id: 'pharmdip', label: 'Pharmacy Diploma',       icon: '💊', cls: 'med' },
        { id: 'otherdip', label: 'Other Diploma',          icon: '📋', cls: 'gen' },
    ],
    'graduation': [
        { id: 'btech',  label: 'B.Tech / B.E.',           icon: '💻', cls: 'sci' },
        { id: 'bsc',    label: 'B.Sc (Science)',           icon: '🔬', cls: 'sci' },
        { id: 'bcom',   label: 'B.Com / BBA',             icon: '📊', cls: 'com' },
        { id: 'ba',     label: 'B.A. (Arts)',             icon: '🎨', cls: 'art' },
        { id: 'mbbs',   label: 'MBBS / BDS',             icon: '🏥', cls: 'med' },
        { id: 'llb',    label: 'LLB',                    icon: '⚖️', cls: 'gen' },
    ],
    'postgrad': [
        { id: 'mtech',  label: 'M.Tech / M.E.',          icon: '⚙️', cls: 'sci' },
        { id: 'mba',    label: 'MBA',                     icon: '📊', cls: 'com' },
        { id: 'msc',    label: 'M.Sc',                   icon: '🔬', cls: 'sci' },
        { id: 'ma',     label: 'M.A.',                   icon: '🎨', cls: 'art' },
        { id: 'md',     label: 'MD / MS (Medical)',      icon: '🏥', cls: 'med' },
        { id: 'llm',    label: 'LLM',                    icon: '⚖️', cls: 'gen' },
    ],
};

/* ─── Path Database ──────────────────────────────────────── */
const pathDB = {
    /* ── 12th PCM ─────────────────────────────────── */
    '12th-pcm': [
        {
            id:'btech', icon:'💻', cat:'Engineering', catCls:'cat-science',
            name:'B.Tech / B.E.', fullName:'Bachelor of Technology / Engineering',
            desc:'India\'s most sought-after degree. Branches include CS, ECE, Mech, Civil, Chemical and more. Opens doors to top MNCs and startups.',
            duration:'4 years', type:'UG Degree', difficulty:'medium',
            salary:'₹4L – ₹18L/year',
            exams:['JEE Main','JEE Advanced','BITSAT','VITEEE','MHT CET'],
            colleges:['IIT Bombay','IIT Delhi','NIT Trichy','BITS Pilani','VIT Vellore','DTU Delhi'],
            careers:['Software Engineer','Data Scientist','Mechanical Engineer','Civil Engineer'],
            tags:['Popular','High ROI'],
            minPercentile: 90,          // approximate cutoffs for national-level entrance
        },
        {
            id:'bsc', icon:'🔬', cat:'Pure Science', catCls:'cat-science',
            name:'B.Sc (Physics/Maths/Chem)', fullName:'Bachelor of Science',
            desc:'Deep dive into theoretical and applied science. Best pathway to research, GATE, or M.Sc → PhD.',
            duration:'3 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3L – ₹10L/year',
            exams:['CUET UG','State CET','NPAT'],
            colleges:['Miranda House (DU)','St. Stephens','IISc Bangalore','Presidency Kolkata'],
            careers:['Research Scientist','Data Analyst','Teacher','IAS Officer'],
            tags:['Research Path'],
            minPercentile: 60,
        },
        {
            id:'barch', icon:'🏗️', cat:'Architecture', catCls:'cat-science',
            name:'B.Arch', fullName:'Bachelor of Architecture',
            desc:'5-year program combining engineering, design and creativity. High demand in urban planning and infrastructure.',
            duration:'5 years', type:'UG Degree', difficulty:'hard',
            salary:'₹4L – ₹15L/year',
            exams:['NATA','JEE Paper 2','HITSEEE'],
            colleges:['IIT Kharagpur','SPA Delhi','CEPT Ahmedabad','NIT Calicut'],
            careers:['Architect','Urban Planner','Interior Designer','Project Manager'],
            tags:['Creative', 'Long Course'],
            minPercentile: 85,
        },
        {
            id:'bsc-aviation', icon:'✈️', cat:'Aviation', catCls:'cat-science',
            name:'B.Sc Aviation / CPL', fullName:'Aviation Science / Commercial Pilot License',
            desc:'Pursue your dream of flying. CPL + type rating leads to airline pilot roles. Highly lucrative career.',
            duration:'3 years', type:'UG Degree', difficulty:'hard',
            salary:'₹8L – ₹35L/year',
            exams:['DGCA Exam','Airline Aptitude Tests'],
            colleges:['Indira Gandhi RGNAU','IGRUA Rae Bareli','DMET','Bombay Flying Club'],
            careers:['Airline Pilot','Air Traffic Controller','Aviation Manager'],
            tags:['High Salary','Niche'],
        },
        {
            id:'merchant-navy', icon:'⚓', cat:'Maritime', catCls:'cat-science',
            name:'Merchant Navy (B.Sc Nautical)', fullName:'Bachelor of Science Nautical Science',
            desc:'Sail the world as a maritime officer. Very high pay, adventurous career with international exposure.',
            duration:'3 years', type:'UG Degree', difficulty:'medium',
            salary:'₹8L – ₹30L/year',
            exams:['IMU CET','DMET Entrance'],
            colleges:['MERI Mumbai','IMU Chennai','DMET Kolkata','HIMT Chennai'],
            careers:['Navigation Officer','Marine Engineer','Port Manager'],
            tags:['High Salary','Unique'],
        },
        {
            id:'bca', icon:'🖥️', cat:'Computer Science', catCls:'cat-science',
            name:'BCA / BCS', fullName:'Bachelor of Computer Applications',
            desc:'3-year degree focused on programming, databases and software development. Quick route to IT industry.',
            duration:'3 years', type:'UG Degree', difficulty:'easy',
            salary:'₹3.5L – ₹14L/year',
            exams:['CUET UG','IPU CET','NIMCET'],
            colleges:['Symbiosis Pune','Christ University','MU','Manipal'],
            careers:['Software Developer','Web Developer','System Analyst','UI/UX Designer'],
            tags:['IT Fast-Track'],
            minPercentile: 50,
        },
    ],

    /* ── 12th PCB ─────────────────────────────────── */
    '12th-pcb': [
        {
            id:'mbbs', icon:'🏥', cat:'Medical', catCls:'cat-medical',
            name:'MBBS', fullName:'Bachelor of Medicine, Bachelor of Surgery',
            desc:'The most prestigious medical degree. 5.5 years of intensive study and internship. Gateway to becoming a doctor.',
            duration:'5.5 years', type:'UG Degree', difficulty:'hard',
            salary:'₹8L – ₹50L+/year',
            exams:['NEET UG'],
            colleges:['AIIMS New Delhi','JIPMER','AFMC Pune','KMC Manipal','CMC Vellore'],
            careers:['Doctor','Surgeon','Medical Officer','Specialist'],
            tags:['Most Prestigious','Competitive'],
            minPercentile: 98,
        },
        {
            id:'bds', icon:'🦷', cat:'Dental', catCls:'cat-medical',
            name:'BDS', fullName:'Bachelor of Dental Surgery',
            desc:'5-year dental degree. Own your clinic or work in hospitals. Growing demand with rising dental awareness.',
            duration:'5 years', type:'UG Degree', difficulty:'hard',
            salary:'₹4L – ₹20L/year',
            exams:['NEET UG'],
            colleges:['Maulana Azad Dental','SDM Dharwad','AIIMS','Saveetha Dental'],
            careers:['Dentist','Oral Surgeon','Dental Researcher'],
            tags:['NEET Based'],
        },
        {
            id:'bpt', icon:'🏃', cat:'Physiotherapy', catCls:'cat-medical',
            name:'BPT', fullName:'Bachelor of Physiotherapy',
            desc:'4.5-year program training rehabilitation specialists. High demand post-COVID in sports and elderly care.',
            duration:'4.5 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3L – ₹12L/year',
            exams:['NEET UG (some)','State CET'],
            colleges:['NIMHANS','AIPT Faridabad','KLEU','Amity'],
            careers:['Physiotherapist','Sports Therapist','Rehabilitation Specialist'],
            tags:['Growing Demand'],
        },
        {
            id:'bpharm', icon:'💊', cat:'Pharmacy', catCls:'cat-medical',
            name:'B.Pharm', fullName:'Bachelor of Pharmacy',
            desc:'4-year degree combining chemistry and medicine. Opens paths to pharma industry, drug research and clinical work.',
            duration:'4 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3L – ₹10L/year',
            exams:['GPAT','State Pharmacy CET'],
            colleges:['Jamia Hamdard','Manipal College of Pharmacy','JSS Mysore'],
            careers:['Pharmacist','Drug Researcher','Clinical Research Associate'],
            tags:['Pharma Industry'],
        },
        {
            id:'bsc-biotech', icon:'🧬', cat:'Biotechnology', catCls:'cat-science',
            name:'B.Sc Biotechnology', fullName:'Bachelor of Science in Biotechnology',
            desc:'Merges biology and technology for cutting-edge careers in biotech, genetics and pharmaceutical R&D.',
            duration:'3 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3.5L – ₹12L/year',
            exams:['CUET UG','JNU Entrance','BHU UET'],
            colleges:['JNU New Delhi','Amity Noida','VIT Vellore','Manipal University'],
            careers:['Biotech Researcher','Genetic Engineer','QC Analyst'],
            tags:['Future Tech'],
        },
        {
            id:'bsc-nursing', icon:'🩺', cat:'Nursing', catCls:'cat-medical',
            name:'B.Sc Nursing', fullName:'Bachelor of Science in Nursing',
            desc:'4-year nursing degree with high global demand. Direct pathways to work abroad in USA, UK, Canada.',
            duration:'4 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3L – ₹15L (abroad: ₹40L+)',
            exams:['NEET UG (optional)','INC Approved Colleges'],
            colleges:['AIIMS Delhi','JIPMER','CMC Vellore','St. Johns Bangalore'],
            careers:['Registered Nurse','ICU Nurse','Nurse Educator','International Nurse'],
            tags:['Global Demand'],
        },
        {
            id:'veterinary', icon:'🐾', cat:'Veterinary', catCls:'cat-medical',
            name:'B.V.Sc & AH', fullName:'Bachelor of Veterinary Science & Animal Husbandry',
            desc:'5.5-year degree to become a veterinary doctor. Career in animal hospitals, livestock management and wildlife.',
            duration:'5.5 years', type:'UG Degree', difficulty:'hard',
            salary:'₹4L – ₹15L/year',
            exams:['NEET UG'],
            colleges:['IVRI Bareilly','GADVASU Ludhiana','TANUVAS','KVASU'],
            careers:['Veterinarian','Animal Researcher','Wildlife Officer'],
            tags:['Unique','Animal Lovers'],
        },
    ],

    /* ── 12th PCMB ────────────────────────────────── */
    '12th-pcmb': [
        {
            id:'mbbs', icon:'🏥', cat:'Medical', catCls:'cat-medical',
            name:'MBBS', fullName:'Bachelor of Medicine, Bachelor of Surgery',
            desc:'With PCMB you have the full advantage — go for medical or engineering. MBBS is the top medical choice.',
            duration:'5.5 years', type:'UG Degree', difficulty:'hard',
            salary:'₹8L – ₹50L+/year',
            exams:['NEET UG'],
            colleges:['AIIMS Delhi','JIPMER Puducherry','AFMC Pune','CMC Vellore'],
            careers:['Doctor','Surgeon','Medical Officer'],
            tags:['Competitive','Prestigious'],
        },
        {
            id:'btech', icon:'💻', cat:'Engineering', catCls:'cat-science',
            name:'B.Tech Biomedical / Bioinformatics', fullName:'Bachelor of Technology (Biomedical Engineering)',
            desc:'With PCMB you can pursue Biomedical Engineering — a unique blend of medicine and technology. Very high demand globally.',
            duration:'4 years', type:'UG Degree', difficulty:'medium',
            salary:'₹5L – ₹20L/year',
            exams:['JEE Main','NEET UG (some)','BITSAT'],
            colleges:['VIT Vellore','Manipal','SASTRA','SRM'],
            careers:['Biomedical Engineer','Medical Device Designer','Clinical Engineer'],
            tags:['Unique Combo','Future Tech'],
        },
        {
            id:'bsc-biotech', icon:'🧬', cat:'Biotechnology', catCls:'cat-science',
            name:'B.Sc Biotechnology / Bioinformatics', fullName:'Bachelor of Science in Biotechnology',
            desc:'Best of both worlds — biology and technology. Great for research careers and pharmaceutical industry.',
            duration:'3 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3.5L – ₹12L/year',
            exams:['CUET UG','JNU Entrance'],
            colleges:['JNU New Delhi','DU','Amity','VIT'],
            careers:['Biotech Researcher','Bioinformatics Analyst'],
            tags:['Research Path'],
        },
    ],

    /* ── 12th Commerce ────────────────────────────── */
    '12th-commerce': [
        {
            id:'ca', icon:'📋', cat:'Professional', catCls:'cat-commerce',
            name:'Chartered Accountancy (CA)', fullName:'ICAI Chartered Accountant',
            desc:'The gold standard of finance careers in India. High earning potential, 3-stage exam process over 4.5 years.',
            duration:'4–5 years', type:'Professional', difficulty:'hard',
            salary:'₹7L – ₹50L+/year',
            exams:['CA Foundation','CA Intermediate','CA Final'],
            colleges:['ICAI (Pan India) — No college required'],
            careers:['Chartered Accountant','CFO','Tax Consultant','Auditor'],
            tags:['Highest Salary','Prestigious'],
        },
        {
            id:'bcom', icon:'📊', cat:'Commerce', catCls:'cat-commerce',
            name:'B.Com (Hons)', fullName:'Bachelor of Commerce (Honours)',
            desc:'3-year foundational commerce degree. Best paired with further qualifications like CA, MBA or CFA.',
            duration:'3 years', type:'UG Degree', difficulty:'easy',
            salary:'₹3L – ₹9L/year',
            exams:['CUET UG','DU Entrance','State CET'],
            colleges:['SRCC Delhi','LSR Delhi','Loyola Chennai','Presidency Kolkata'],
            careers:['Accountant','Finance Analyst','Banking Officer'],
            tags:['Foundation'],
        },
        {
            id:'bba', icon:'💼', cat:'Management', catCls:'cat-management',
            name:'BBA / BMS', fullName:'Bachelor of Business Administration',
            desc:'3-year management degree. Gateway to MBA and corporate leadership roles. Strong in marketing, HR, finance.',
            duration:'3 years', type:'UG Degree', difficulty:'easy',
            salary:'₹3L – ₹10L/year',
            exams:['IPMAT (IIM)','CUET UG','SET'],
            colleges:['IIM Indore IPM','Symbiosis Pune','Christ DU','NMIMS Mumbai'],
            careers:['Business Analyst','Marketing Manager','HR Manager','Entrepreneur'],
            tags:['Management'],
        },
        {
            id:'cfa', icon:'📈', cat:'Finance', catCls:'cat-commerce',
            name:'CFA (Chartered Financial Analyst)', fullName:'CFA Program by CFA Institute USA',
            desc:'Global finance credential, 3 levels. Highly respected in investment banking, portfolio management and hedge funds.',
            duration:'2–4 years', type:'Professional', difficulty:'hard',
            salary:'₹8L – ₹60L+/year',
            exams:['CFA Level 1, 2, 3'],
            colleges:['Self Study / Online'],
            careers:['Investment Analyst','Portfolio Manager','Equity Researcher'],
            tags:['Global','High Salary'],
        },
        {
            id:'economics', icon:'🏛️', cat:'Economics', catCls:'cat-commerce',
            name:'B.Sc Economics', fullName:'Bachelor of Science in Economics',
            desc:'Analytical economics program combining quantitative methods with policy analysis. Great for civil services, research, banking.',
            duration:'3 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3.5L – ₹12L/year',
            exams:['DSE Entrance','JNU Entrance','CUET UG'],
            colleges:['DSE Delhi','JNU','Presidency','Jadavpur'],
            careers:['Economist','Policy Analyst','IAS Officer','Banker'],
            tags:['Research + Policy'],
        },
    ],

    /* ── 12th Arts  ───────────────────────────────── */
    '12th-arts': [
        {
            id:'llb', icon:'⚖️', cat:'Law', catCls:'cat-law',
            name:'BA LLB / LLB', fullName:'Integrated / Regular Bachelor of Laws',
            desc:'5-year integrated or 3-year regular LLB. Opens pathways to litigation, corporate law, civil services, judiciary.',
            duration:'3–5 years', type:'Professional Degree', difficulty:'medium',
            salary:'₹4L – ₹30L+/year',
            exams:['CLAT','AILET','LSAT India','State Bar Council'],
            colleges:['NLU Delhi','NLU Jodhpur','NALSAR Hyderabad','Symbiosis Law','BHU'],
            careers:['Advocate','Corporate Lawyer','Judge','Legal Advisor'],
            tags:['Prestigious','Versatile'],
        },
        {
            id:'bfa', icon:'🎨', cat:'Fine Arts & Design', catCls:'cat-arts',
            name:'BFA / B.Des', fullName:'Bachelor of Fine Arts / Design',
            desc:'4-year creative program in UI/UX design, product design, animation, graphic design and fine arts.',
            duration:'4 years', type:'UG Degree', difficulty:'medium',
            salary:'₹3L – ₹20L/year',
            exams:['NID DAT','NIFT Entrance','UCEED','CEED'],
            colleges:['NID Ahmedabad','NIFT Delhi','Pearl Academy','MIT ID Pune','JJ School Mumbai'],
            careers:['UI/UX Designer','Graphic Designer','Animator','Brand Strategist'],
            tags:['Creative','High Demand'],
        },
        {
            id:'bjmc', icon:'📰', cat:'Journalism', catCls:'cat-arts',
            name:'BJMC', fullName:'Bachelor of Journalism and Mass Communication',
            desc:'3-year media program covering journalism, PR, digital media and content creation. Perfect for storytellers.',
            duration:'3 years', type:'UG Degree', difficulty:'easy',
            salary:'₹3L – ₹12L/year',
            exams:['IIMC Entrance','Symbiosis SSET','CUET UG'],
            colleges:['IIMC New Delhi','ACJ Chennai','Symbiosis Pune','Xavier Mumbai'],
            careers:['Journalist','Content Creator','PR Manager','Documentary Filmmaker'],
            tags:['Media & Communication'],
        },
        {
            id:'bapsych', icon:'🧠', cat:'Psychology', catCls:'cat-arts',
            name:'B.A. Psychology', fullName:'Bachelor of Arts in Psychology',
            desc:'Understand the human mind. Leads to clinical psychology, counselling, HR and organizational behaviour roles.',
            duration:'3 years', type:'UG Degree', difficulty:'easy',
            salary:'₹3L – ₹10L/year',
            exams:['CUET UG','PU CET','State CET'],
            colleges:['Lady Shri Ram (DU)','Christ University','Fergusson','St. Xaviers'],
            careers:['Counsellor','Clinical Psychologist','HR Manager','Social Worker'],
            tags:['Mental Health','Growing'],
        },
        {
            id:'civil-services', icon:'🏛️', cat:'Civil Services', catCls:'cat-law',
            name:'B.A. + UPSC Preparation', fullName:'Civil Services (IAS/IPS/IFS)',
            desc:'Arts graduates have a historical edge in UPSC. Subjects like History, Polity, Geography, Sociology are directly tested.',
            duration:'3+2 years', type:'Govt Exam Pathway', difficulty:'hard',
            salary:'₹6L – ₹14L/year (govt scale)',
            exams:['UPSC CSE','State PSC'],
            colleges:['Any DU / Central Univ. + Coaching'],
            careers:['IAS Officer','IPS Officer','IFS Officer','SDM / DM'],
            tags:['Government','Prestigious'],
        },
    ],

    /* ── 10th ─────────────────────────────────────── */
    '10th-any': [
        {
            id:'11science', icon:'🔬', cat:'continuation', catCls:'cat-science',
            name:'Class 11th – Science (PCM / PCB)', fullName:'Senior Secondary – Science Stream',
            desc:'Choose PCM for engineering and PCB for medical. The most popular post-10th route for ambitious students.',
            duration:'2 years', type:'Senior Secondary', difficulty:'medium',
            salary:'Opens to ₹4L – ₹50L+ after graduation',
            exams:['Board Exams (JEE / NEET prep begins)'],
            colleges:['Government / Private Schools Pan India'],
            careers:['Engineer','Doctor','Scientist (after graduation)'],
            tags:['Most Popular'],
        },
        {
            id:'11commerce', icon:'📊', cat:'continuation', catCls:'cat-commerce',
            name:'Class 11th – Commerce', fullName:'Senior Secondary – Commerce Stream',
            desc:'Best for aspiring CAs, bankers and business leaders. Subjects: Accounts, Business Studies, Economics, Maths.',
            duration:'2 years', type:'Senior Secondary', difficulty:'easy',
            salary:'Opens to ₹3L – ₹50L+ after higher studies',
            exams:['Board Exams + CA Foundation prep'],
            colleges:['Government / Private Schools Pan India'],
            careers:['CA, Banker, Entrepreneur (after higher studies)'],
            tags:['Business Path'],
        },
        {
            id:'11arts', icon:'🎨', cat:'continuation', catCls:'cat-arts',
            name:'Class 11th – Arts / Humanities', fullName:'Senior Secondary – Humanities Stream',
            desc:'Versatile stream covering History, Geography, Polity, Literature. Best for civil services, law, journalism, design.',
            duration:'2 years', type:'Senior Secondary', difficulty:'easy',
            salary:'Opens to ₹3L – ₹30L+ based on specialization',
            exams:['Board Exams + CLAT / CUET prep'],
            colleges:['Government / Private Schools Pan India'],
            careers:['Lawyer, Journalist, Designer, IAS (after graduation)'],
            tags:['Versatile'],
        },
        {
            id:'polytechnic', icon:'🔧', cat:'Diploma', catCls:'cat-diploma',
            name:'Polytechnic / ITI Diploma', fullName:'Government Polytechnic / Industrial Training Institute',
            desc:'3-year hands-on technical diploma. Great alternative to 12th if you want to enter the workforce sooner.',
            duration:'2–3 years', type:'Diploma', difficulty:'easy',
            salary:'₹2L – ₹8L/year',
            exams:['Polytechnic Entrance Test (CET)','ITI Admission'],
            colleges:['Government Polytechnics','ITI Centres Pan India'],
            careers:['Electrician','Fitter','Welder','Junior Engineer'],
            tags:['Early Job Entry','Technical'],
        },
    ],

    /* ── Diploma Engineering ──────────────────────── */
    'diploma-engdip': [
        {
            id:'lateral', icon:'⚙️', cat:'Engineering', catCls:'cat-science',
            name:'Lateral Entry B.Tech (2nd Year)', fullName:'Lateral Entry into B.Tech – Direct 2nd Year',
            desc:'Diploma holders can skip 1st year of B.Tech through Lateral Entry. Best path to a full engineering degree.',
            duration:'3 years', type:'UG Degree (Lateral)', difficulty:'medium',
            salary:'₹4L – ₹18L/year',
            exams:['State Lateral Entry CET (KCET,MHT etc)','UPSEE Lateral'],
            colleges:['All NITs','State Engineering Colleges'],
            careers:['Software/Mechanical/Civil Engineer'],
            tags:['Fast Track','Smart Choice'],
        },
        {
            id:'amie', icon:'📐', cat:'Engineering', catCls:'cat-science',
            name:'AMIE (Associate Member by Institution of Engineers)',
            fullName:'AMIE – Alternative to B.E. for Diploma Holders',
            desc:'Earn a B.E. equivalent through exams while working. Flexible, distance-education based engineering qualification.',
            duration:'3–5 years', type:'Professional Exam', difficulty:'medium',
            salary:'₹4L – ₹12L/year',
            exams:['AMIE Section A & B Exams'],
            colleges:['Institution of Engineers (IEI), Pan India'],
            careers:['Junior Engineer','Technical Officer','Plant Manager'],
            tags:['Work While Study'],
        },
    ],

    /* ── Graduation B.Tech ────────────────────────── */
    'graduation-btech': [
        {
            id:'mtech', icon:'⚙️', cat:'PG Engineering', catCls:'cat-science',
            name:'M.Tech / M.E.', fullName:'Master of Technology',
            desc:'2-year master\'s in a specialized engineering branch. GATE score gets you IIT/NIT admission + stipend.',
            duration:'2 years', type:'PG Degree', difficulty:'hard',
            salary:'₹8L – ₹30L/year',
            exams:['GATE'],
            colleges:['IIT Bombay','IIT Delhi','IISC','NIT Trichy'],
            careers:['Senior Engineer','R&D Scientist','Professor','DRDO Scientist'],
            tags:['GATE Required','Research'],
            minPercentile: 90,
        },
        {
            id:'mba-iit', icon:'💼', cat:'Management', catCls:'cat-management',
            name:'MBA (Tech MBA / Regular)', fullName:'Master of Business Administration',
            desc:'Top engineers pivot to management. IIMs, XLRI, FMS offer world-class MBA programs. Salary jumps dramatically.',
            duration:'2 years', type:'PG Degree', difficulty:'hard',
            salary:'₹15L – ₹80L+/year',
            exams:['CAT','GMAT','XAT'],
            colleges:['IIM Ahmedabad','IIM Bangalore','XLRI Jamshedpur','FMS Delhi','SPJIMR'],
            careers:['Product Manager','Consultant','Entrepreneur','VP Engineering'],
            tags:['Career Switch','High Salary'],
        },
        {
            id:'ms-abroad', icon:'🌍', cat:'Abroad', catCls:'cat-science',
            name:'M.S. Abroad (USA / Germany / Canada)', fullName:'Master of Science – International',
            desc:'Study at world-class universities abroad. Work visa opportunities post-study. Tech companies pay top salaries.',
            duration:'1.5–2 years', type:'PG Degree (Abroad)', difficulty:'hard',
            salary:'₹25L – ₹1Cr+/year',
            exams:['GRE','TOEFL','IELTS'],
            colleges:['MIT','Stanford','TU Munich','University of Toronto'],
            careers:['AI Researcher','ML Engineer','Hardware Engineer'],
            tags:['Abroad','Highest ROI'],
            minPercentile: 75,
        },
    ],
};

/* ─── State ─────────────────────────────────────── */
let selectedLevel = '';
let selectedStream = '';
let savedPaths = new Set();
let currentData = [];

/* ─── DOM References ─────────────────────────────── */
const eduLevel    = document.getElementById('educationLevel');
const streamSec   = document.getElementById('streamSection');
const streamGrid  = document.getElementById('streamGrid');
const percentileSec = document.getElementById('percentileSection');
const interestSec   = document.getElementById('interestSection');
const chips       = document.getElementById('selectionChips');
const btnExplore  = document.getElementById('btnExplore');
const btnReset    = document.getElementById('btnReset');
const resultsPanel= document.getElementById('resultsPanel');
const emptyState  = document.getElementById('emptyState');
const modal       = document.getElementById('modalOverlay');
const modalClose  = document.getElementById('modalClose');

// optional filter listeners (only attach once)
document.getElementById('percentile').addEventListener('change', () => {
    updateChips();
    if (selectedLevel && selectedStream) explorePaths();
});
document.getElementById('careerInterest').addEventListener('change', () => {
    updateChips();
    if (selectedLevel && selectedStream) explorePaths();
});

/* ─── Step 1: Education Level Changed ────────────── */
eduLevel.addEventListener('change', () => {
    selectedLevel = eduLevel.value;
    selectedStream = '';
    updateChips();

    if (!selectedLevel) {
        streamSec.style.display = 'none';
        percentileSec.style.display = 'none';
        interestSec.style.display = 'none';
        btnExplore.disabled = true;
        updateStepIndicator(1);
        emptyState.style.display = 'flex';
        document.querySelectorAll('.results-header, .paths-container, .no-results').forEach(el => el.remove());
        return;
    }

    // Populate streams
    const opts = streamOptions[selectedLevel] || [];
    streamGrid.innerHTML = '';
    opts.forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'stream-btn';
        btn.dataset.id = s.id;
        btn.innerHTML = `<span class="stream-icon ${s.cls}">${s.icon}</span>${s.label}`;
        btn.addEventListener('click', () => {
            selectStream(s.id, s.label, btn);
            if(selectedLevel && selectedStream) {
                explorePaths();
            }
        });
        streamGrid.appendChild(btn);
    });

    streamSec.style.display = 'block';
    percentileSec.style.display = 'block';
    interestSec.style.display = 'block';
    updateStepIndicator(2);
    
    // If only one option (e.g., 10th), auto-select and auto-explore
    if (opts.length === 1) {
        selectStream(opts[0].id, opts[0].label, streamGrid.querySelector('.stream-btn'));
        explorePaths();
    }
});

/* ─── Step 2: Stream Selected ────────────────────── */
function selectStream(id, label, btn) {
    selectedStream = id;
    document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    updateChips();
    btnExplore.disabled = false;
    updateStepIndicator(3);
}

/* ─── Update chip display ────────────────────────── */
function updateChips() {
    chips.innerHTML = '';
    if (selectedLevel) {
        chips.innerHTML += `<span class="chip"><i class="fas fa-graduation-cap"></i> ${eduLevel.options[eduLevel.selectedIndex].text}</span>`;
    }
    if (selectedStream) {
        const btn = streamGrid.querySelector(`.stream-btn[data-id="${selectedStream}"]`);
        if (btn) {
            chips.innerHTML += `<span class="chip"><i class="fas fa-layer-group"></i> ${btn.textContent.trim()}</span>`;
        }
    }
    const percVal = document.getElementById('percentile').value;
    if (percVal) {
        const text = document.querySelector('#percentile option[value="' + percVal + '"]').textContent;
        chips.innerHTML += `<span class="chip"><i class="fas fa-chart-bar"></i> ${text}</span>`;
    }
    const interestVal = document.getElementById('careerInterest').value;
    if (interestVal) {
        const text = document.querySelector('#careerInterest option[value="' + interestVal + '"]').textContent;
        chips.innerHTML += `<span class="chip"><i class="fas fa-heart"></i> ${text}</span>`;
    }
}

/* ─── Step indicator update ─────────────────────── */
function updateStepIndicator(active) {
    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById(`sdot${i}`);
        if (!dot) continue;
        dot.classList.remove('active','done');
        if (i < active) dot.classList.add('done');
        else if (i === active) dot.classList.add('active');
    }
    for (let i = 1; i <= 2; i++) {
        const con = document.getElementById(`scon${i}`);
        if (!con) continue;
        con.classList.toggle('done', i < active);
    }
}

/* ─── Explore Button ─────────────────────────────── */
btnExplore.addEventListener('click', explorePaths);
btnReset.addEventListener('click', resetAll);

function explorePaths() {
    const key = `${selectedLevel}-${selectedStream}`;
    const paths = pathDB[key] || [];
    currentData = paths;

    // apply interest filter first
    const interest = document.getElementById('careerInterest').value;
    let filtered = interest ? filterByInterest(paths, interest) : paths;

    // then apply percentile filter if given
    const perc = document.getElementById('percentile').value;
    if (perc) {
        filtered = filterByPercentile(filtered, perc);
    }

    renderResults(filtered, key);
    btnReset.style.display = 'flex';
    updateStepIndicator(3);
    const dot3 = document.getElementById('sdot3');
    if (dot3) { dot3.classList.remove('active'); dot3.classList.add('done'); }
}

function filterByInterest(paths, interest) {
    const map = {
        tech:['Engineering','Computer Science','Aviation','Maritime'],
        medical:['Medical','Dental','Pharmacy','Nursing','Physiotherapy','Biotechnology','Veterinary'],
        business:['Management','Professional','Commerce','Finance'],
        creative:['Fine Arts & Design','Journalism','Architecture'],
        law:['Law','Civil Services'],
        education:['Pure Science'],
        research:['Biotechnology','Pure Science'],
        media:['Journalism'],
    };
    const allowed = map[interest] || [];
    return paths.filter(p => allowed.some(a => p.cat.toLowerCase().includes(a.toLowerCase())));
}

/* ─── Render Results ─────────────────────────────── */
function renderResults(paths, key) {
    // Remove existing results
    document.querySelectorAll('.results-header, .paths-container, .no-results').forEach(el => el.remove());

    if (!paths || paths.length === 0) {
        emptyState.style.display = 'none';
        const noRes = document.createElement('div');
        noRes.className = 'empty-state no-results';
        noRes.innerHTML = `<div class="empty-icon">🔍</div><h3>No Paths Found</h3><p>Try selecting a different stream or clearing the career interest filter to see all available paths.</p>`;
        resultsPanel.appendChild(noRes);
        return;
    }

    emptyState.style.display = 'none';

    // Header
    const header = document.createElement('div');
    header.className = 'results-header';
    header.innerHTML = `
        <div class="results-title">
            <h3>Available Paths</h3>
            <p>${eduLevel.options[eduLevel.selectedIndex].text}</p>
        </div>
        <span class="results-count"><i class="fas fa-check-circle"></i> ${paths.length} paths found</span>
    `;
    resultsPanel.appendChild(header);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'paths-container';
    paths.forEach((p, i) => {
        const card = createPathCard(p, i);
        grid.appendChild(card);
    });
    resultsPanel.appendChild(grid);
}

/* ─── Create Card ─────────────────────────────────── */
function createPathCard(p, index) {
    const card = document.createElement('div');
    card.className = `result-path-card ${p.catCls}`;
    card.style.animationDelay = (index * 0.06) + 's';

    const isSaved = savedPaths.has(p.id);
    card.innerHTML = `
        <div class="path-card-header">
            <span class="difficulty ${getDiffClass(p.difficulty)}">${capitalize(p.difficulty)}</span>
            <div class="path-category"><i class="fas fa-tag"></i> ${p.cat}</div>
            <div class="path-icon-large">${p.icon}</div>
            <div class="path-name">${p.name}</div>
            <div class="path-full-name">${p.fullName}</div>
        </div>
        <div class="path-card-body">
            <div class="path-description">${p.desc.substring(0, 120)}…</div>
            <div class="path-quick-info">
                <span class="path-info-item"><i class="fas fa-clock"></i> ${p.duration}</span>
                <span class="path-info-item"><i class="fas fa-certificate"></i> ${p.type}</span>
            </div>
            <div class="path-salary">
                <span class="salary-label"><i class="fas fa-rupee-sign"></i> Expected Salary</span>
                <span class="salary-value">${p.salary}</span>
            </div>
            <div class="path-colleges">
                <div class="path-colleges-label">Top Institutes</div>
                <div class="path-college-tags">
                    ${p.colleges.slice(0,3).map(c => `<span class="college-tag">${c}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="path-card-footer">
            <button class="btn-path-detail">View Full Details</button>
            <button class="btn-path-save ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Saved' : 'Save path'}">
                <i class="fa${isSaved ? 's' : 'r'} fa-heart"></i>
            </button>
        </div>
    `;

    card.querySelector('.btn-path-detail').addEventListener('click', () => openModal(p));
    card.querySelector('.btn-path-save').addEventListener('click', (e) => toggleSave(p.id, e.currentTarget));
    return card;
}

/* ─── Filter helpers ─────────────────────────────── */
function filterByPercentile(paths, percentile) {
    // convert the selection into a numeric threshold (student percentile)
    const studentPct = {
        '90plus': 90,
        '75to90': 75,
        '60to75': 60,
        'below60': 0,
    }[percentile];
    if (studentPct === undefined) return paths;
    return paths.filter(p => {
        if (p.minPercentile == null) return true; // no data; assume eligible
        return studentPct >= p.minPercentile;
    });
}

/* ─── Toggle Save ────────────────────────────────── */
function toggleSave(id, btn) {
    if (savedPaths.has(id)) {
        savedPaths.delete(id);
        btn.classList.remove('saved');
        btn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        savedPaths.add(id);
        btn.classList.add('saved');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
    }
}

/* ─── Open Modal ─────────────────────────────────── */
function openModal(p) {
    document.getElementById('modalIcon').innerHTML = p.icon;
    document.getElementById('modalIcon').style.background = getIconBg(p.catCls);
    document.getElementById('modalCategory').textContent = p.cat;
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalSubtitle').textContent = p.fullName;

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-info-circle"></i> About This Path</div>
            <p style="color:var(--text-light); font-size:0.9rem; line-height:1.75">${p.desc}</p>
        </div>
        <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-list"></i> Key Details</div>
            <div class="modal-info-grid">
                <div class="modal-info-item"><div class="modal-info-label">Duration</div><div class="modal-info-value">${p.duration}</div></div>
                <div class="modal-info-item"><div class="modal-info-label">Degree Type</div><div class="modal-info-value">${p.type}</div></div>
                <div class="modal-info-item"><div class="modal-info-label">Starting Salary</div><div class="modal-info-value" style="color:var(--success)">${p.salary}</div></div>
                <div class="modal-info-item"><div class="modal-info-label">Difficulty</div><div class="modal-info-value">${capitalize(p.difficulty)}</div></div>
            </div>
        </div>
        <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-file-alt"></i> Entrance Exams</div>
            <div class="modal-exams">${p.exams.map(e => `<span class="exam-tag">${e}</span>`).join('')}</div>
        </div>
        <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-university"></i> Top Colleges / Institutions</div>
            <div class="modal-colleges-grid">${p.colleges.map(c => `<div class="modal-college-item"><i class="fas fa-building-columns"></i> ${c}</div>`).join('')}</div>
        </div>
        <div class="modal-section">
            <div class="modal-section-title"><i class="fas fa-briefcase"></i> Career Opportunities</div>
            <ul class="modal-list">${p.careers.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

/* ─── Reset ──────────────────────────────────────── */
function resetAll() {
    selectedLevel = '';
    selectedStream = '';
    eduLevel.value = '';
    // clear optional filters too
    document.getElementById('percentile').value = '';
    document.getElementById('careerInterest').value = '';
    streamSec.style.display = 'none';
    percentileSec.style.display = 'none';
    interestSec.style.display = 'none';
    chips.innerHTML = '';
    btnExplore.disabled = true;
    btnReset.style.display = 'none';
    document.querySelectorAll('.results-header, .paths-container, .no-results').forEach(el => el.remove());
    emptyState.style.display = '';
    updateStepIndicator(1);
}

/* ─── Helpers ────────────────────────────────────── */
function getDiffClass(d) {
    return d === 'easy' ? 'easy' : d === 'medium' ? 'medium' : 'hard';
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function getIconBg(cls) {
    const map = {
        'cat-science':'linear-gradient(135deg,#7c3aed,#4f46e5)',
        'cat-medical':'linear-gradient(135deg,#ec4899,#be185d)',
        'cat-commerce':'linear-gradient(135deg,#10b981,#059669)',
        'cat-arts':'linear-gradient(135deg,#f59e0b,#ef4444)',
        'cat-diploma':'linear-gradient(135deg,#06b6d4,#0284c7)',
        'cat-law':'linear-gradient(135deg,#6366f1,#4338ca)',
        'cat-management':'linear-gradient(135deg,#f59e0b,#d97706)',
    };
    return map[cls] || 'linear-gradient(135deg,#7c3aed,#06b6d4)';
}

/* ─── Pre-select from URL params ─────────────────── */
(function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const stream = params.get('stream');
    if (!stream) return;
    const streamMap = {
        pcm:'12th-pcm', pcb:'12th-pcb', commerce:'12th-commerce', arts:'12th-arts'
    };
    const key = streamMap[stream];
    if (!key) return;
    const [level, st] = key.split('-');
    setTimeout(() => {
        eduLevel.value = level;
        eduLevel.dispatchEvent(new Event('change'));
        setTimeout(() => {
            const btn = streamGrid.querySelector(`[data-id="${st}"]`);
            if (btn) btn.click();
        }, 100);
    }, 200);
})();
