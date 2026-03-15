<div align="center">

# 🎓 Pragati — प्रगति

### *An Indian Career Guidance & Learning Platform*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)

> **Pragati** (प्रगति) means *progress* in Sanskrit. The platform empowers Indian students to discover their ideal career paths based on their educational background and learn through structured, quiz-gated courses.

</div>

---

## ✨ Features

- 🗺️ **Path Explorer** — Select your education level (10th → PhD) and discover recommended career streams and paths
- 📚 **Course Catalog** — Browse all available courses; enroll after logging in
- 🎯 **Chapter-by-Chapter Learning** — Each course is divided into chapters with a quiz gate before progression
- 🏅 **Certificates** — Earn a certificate upon completing a course
- 👤 **Student Dashboard** — Track enrolled courses, chapter progress, and earned certificates
- 🛡️ **Admin Dashboard** — Manage courses, chapters, students, and enrollments
- 🔐 **JWT Authentication** — Secure login/register with hashed passwords and token-based sessions

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Dev Server** | Nodemon |

---

## 📁 Project Structure

```
Pragati/
├── frontend/
│   ├── pages/              # All HTML pages
│   │   ├── index.html          # Landing page
│   │   ├── about.html          # About Pragati
│   │   ├── explore.html        # Path explorer (public)
│   │   ├── path-explorer.html  # Full guided path explorer (login required)
│   │   ├── courses.html        # Course catalog
│   │   ├── course-detail.html  # Individual course view
│   │   ├── learn.html          # Chapter viewer + quiz
│   │   ├── login.html          # Login page
│   │   ├── register.html       # Sign-up page
│   │   ├── user-dashboard.html # Student dashboard
│   │   ├── admin-dashboard.html# Admin dashboard
│   │   ├── contact.html        # Contact page
│   │   ├── browse-paths.html   # Browse career paths
│   │   ├── streams.html        # Education streams
│   │   └── education-levels.html
│   ├── styles/             # CSS files (one per page/component)
│   ├── scripts/            # JavaScript files (one per page/component)
│   └── assets/
│       ├── images/
│       └── icons/
│
└── backend/
    ├── server.js           # Express app entry point
    ├── package.json
    ├── .env.example        # ← copy to .env and fill your values
    ├── config/             # DB connection & config
    ├── models/             # Mongoose schemas (User, Course, Chapter, Enrollment…)
    ├── controllers/        # Route handler logic
    ├── routes/             # Express route definitions
    ├── middleware/         # Auth middleware (JWT verification)
    ├── api/                # Utility/helper API modules
    ├── database/           # DB schema reference
    └── seeds/              # Seed script to populate sample data
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas URI)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/SuyashT0911/PRAGATI.git
cd PRAGATI
```

### 2. Set up the backend

```bash
cd backend
npm install
```

### 3. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env
```

Now open `backend/.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pragati
JWT_SECRET=your_super_secret_key_here
```

### 4. (Optional) Seed the database

```bash
npm run seed
```

This populates the database with sample education paths, courses, chapters, and an admin account.

### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The app will be available at **http://localhost:5000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user | Public |
| POST | `/api/v1/auth/login` | Login & receive JWT | Public |
| GET | `/api/v1/courses` | List all courses | Public |
| GET | `/api/v1/courses/:id` | Get course details | Public |
| GET | `/api/v1/chapters/:id` | Get chapter content | 🔒 User |
| POST | `/api/v1/enroll` | Enroll in a course | 🔒 User |
| GET | `/api/v1/my-enrollments` | Get user's enrollments | 🔒 User |
| POST | `/api/v1/chapters/:id/complete` | Mark chapter complete | 🔒 User |
| GET | `/api/v1/admin/courses` | Admin: manage courses | 🔒 Admin |
| GET | `/api/v1/health` | Health check | Public |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary — Indigo | `#4f46e5` |
| Secondary — Teal | `#0d9488` |
| Accent — Amber | `#f59e0b` |
| Background | `#f8fafc` |
| Font | Inter (Google Fonts) |

The design is **light-themed**, professional, and warm — built to feel motivating for students.

---

## 🗺️ Roadmap

- [x] Landing page with path overview
- [x] About, Contact, Explore pages
- [x] JWT Authentication (register / login)
- [x] Student & Admin dashboards
- [x] Course catalog & detail pages
- [x] Path Explorer (stream & level based)
- [x] Chapter viewer with quiz gate
- [x] REST API (Express + MongoDB)
- [ ] Certificate generation (PDF)
- [ ] AI-powered personalized path recommendations
- [ ] Progressive Web App (PWA) support
- [ ] Payment gateway for premium courses

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Made with ❤️ by [Suyash Tiwari](https://github.com/SuyashT0911)

*Pragati — Making every student's journey count.*

</div>
