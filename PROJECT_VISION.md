# 🎓 Pragati — Project Vision & Roadmap

## What is Pragati?

An Indian education guidance + learning platform. Students select their past education to discover future paths, then can enroll in courses, learn chapter by chapter, pass chapter quizzes, and earn certificates.

## Color Theme

- Light, calm, education-oriented
- Primary: Indigo Blue (#4f46e5) + Teal (#0d9488)
- Accent: Amber (#f59e0b)
- Background: White / Light gray (#f8fafc)
- NOT dark theme — professional, warm, motivating

## Pages (Separate HTML files)

1. index.html — Landing page (beautiful, no specific course mentions in hero)
2. about.html — About Pragati, mission, team
3. explore.html — Path Explorer (browse without login, full guider = login required)
4. courses.html — Browse all courses (public view, enroll = login required)
5. login.html — Login page
6. register.html — Sign up page
7. dashboard.html — Student dashboard (login required)
8. admin.html — Admin dashboard (admin login required)
9. path-detail.html — Detailed path with associated courses
10. course-view.html — Course chapter viewer + quiz system
11. contact.html — Contact page

## Navigation Bar (ALL pages)

- Logo: Pragati (प्र symbol)
- Links: Home | About | Explore Paths | Courses | Contact
- Auth: Login button / User avatar (if logged in)

## Path System Rules

- PCMB = PCM + PCB (Union of all paths)
- Education levels: 10th → 11th → 12th → Diploma → Graduation → Post-Grad → PhD
- ALL levels must have paths
- Browse basic info without login
- Full career path guider REQUIRES login

## Course System (Future)

- Each path → associated courses
- Each course → chapters
- Each chapter → small quiz (must pass to unlock next)
- Completion → Certificate with user name + course name + date
- Dashboard shows: enrolled courses, progress per chapter, certificates earned

## File Structure

frontend/
pages/ → All HTML files
styles/ → main.css, landing.css, auth.css, dashboard.css, admin.css, explore.css
scripts/ → main.js, landing.js, auth.js, dashboard.js, admin.js, explore.js, paths-data.js
assets/
icons/
images/
backend/
auth/login.php, register.php, logout.php
api/paths.php, courses.php, progress.php, quiz.php, certificates.php
config/db.php, config.php
database/schema.sql

## Phase 1 (Current Focus)

- [x] Landing page (beautiful, light theme, separate)
- [x] Navigation linking separate pages
- [ ] About page
- [ ] Explore paths page (better UI)
- [ ] Login + Register pages
- [ ] Basic user dashboard (stub)
- [ ] Admin dashboard (improve existing)

## Phase 2 (Next)

- Course detail pages
- Chapter viewer with quiz
- Progress tracking
- Certificate generation

## Phase 3 (Later)

- Backend PHP + MySQL integration
- Payment gateway (if premium courses)
- AI-powered personalized recommendations
- Mobile app (PWA)
