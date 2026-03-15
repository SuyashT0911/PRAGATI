<div align="center">

# 🎓 Pragati — प्रगति

### *An Indian Career Guidance & Learning Platform*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com)

> **Pragati** (प्रगति) means *progress* in Sanskrit. A platform for Indian students to discover career paths based on their education level and learn through structured, quiz-gated courses.

</div>

---

## ✨ Features

- 🗺️ **Path Explorer** — Select your education level (10th → PhD) and discover recommended career streams and paths
- 📚 **Course Catalog** — Browse courses by stream, degree, and difficulty; enroll after logging in
- 📖 **Chapter-by-Chapter Learning** — Markdown-rendered content with code examples, video links, and external resources
- 🧠 **Quiz Gate** — Each chapter has an MCQ quiz (default 70% pass mark) that must be passed to progress
- 🏅 **Certificates** — Auto-generated upon completing all chapters of a course
- 👤 **Student Dashboard** — Track enrolled courses, chapter progress, and earned certificates
- 🛡️ **Admin Dashboard** — Manage users, courses, chapters, and view platform stats & activity feed
- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing and token-based sessions

---

## 🖥️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| **HTML5** | Page structure — 15 separate HTML pages |
| **CSS3 (Vanilla)** | Styling — one stylesheet per page/component |
| **JavaScript (ES6+, Vanilla)** | All interactivity — one script per page |

No frameworks, no bundlers — pure HTML/CSS/JS served as static files.

### Backend
| Technology | Usage |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js 4.x** | HTTP server & REST API routing |
| **MongoDB** | Database |
| **Mongoose** | ODM — schema definitions & queries |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **marked** | Renders chapter content (stored as Markdown) |
| **dotenv** | Environment variable management |
| **cors** | Cross-origin resource sharing |
| **nodemon** | Dev auto-reload |

---

## 📁 Project Structure

```
Pragati/
├── frontend/
│   ├── pages/                    # 15 HTML pages
│   │   ├── index.html            # Landing page
│   │   ├── about.html            # About Pragati
│   │   ├── explore.html          # Public path preview
│   │   ├── path-explorer.html    # Full guided explorer (login required)
│   │   ├── browse-paths.html     # Browse career paths
│   │   ├── streams.html          # Education streams
│   │   ├── education-levels.html # Education levels overview
│   │   ├── courses.html          # Course catalog
│   │   ├── course-detail.html    # Individual course page
│   │   ├── learn.html            # Chapter viewer + quiz
│   │   ├── login.html            # Login page
│   │   ├── register.html         # Sign-up page
│   │   ├── user-dashboard.html   # Student dashboard
│   │   ├── admin-dashboard.html  # Admin dashboard
│   │   └── contact.html          # Contact page
│   ├── styles/                   # CSS — one file per page
│   │   ├── main.css, landing.css, auth.css, dashboard.css
│   │   ├── admin.css, courses.css, course-detail.css
│   │   ├── learn.css, path-explorer.css, explore.css
│   │   ├── about.css, contact.css, pages.css
│   │   └── streams.css, education-levels.css
│   ├── scripts/                  # JS — one file per page
│   │   ├── main.js, landing.js, auth.js, register.js
│   │   ├── dashboard.js, admin.js, nav-auth.js
│   │   ├── courses.js, course-detail.js
│   │   ├── learn.js, path-explorer.js
│   └── assets/
│       ├── images/
│       └── icons/
│
└── backend/
    ├── server.js                 # App entry point
    ├── package.json
    ├── .env.example              # ← copy to .env and fill your values
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── models/                   # Mongoose schemas
    │   ├── User.js               # firstName, lastName, email, role (student/admin), eduLevel
    │   ├── Course.js             # title, slug, stream, degree, university, difficulty, tags…
    │   ├── Chapter.js            # content (Markdown), quiz (MCQ), codeExamples, resources…
    │   ├── Enrollment.js         # user ↔ course link + progress
    │   ├── Progress.js           # per-chapter completion + quiz scores
    │   ├── Certificate.js        # issued certificates
    │   └── Activity.js           # admin activity feed
    ├── controllers/              # Route handler logic
    │   ├── auth.controller.js
    │   ├── course.controller.js
    │   ├── chapter.controller.js
    │   ├── enrollment.controller.js
    │   └── admin.controller.js
    ├── routes/                   # Express routers
    │   ├── auth.routes.js
    │   ├── course.routes.js
    │   ├── chapter.routes.js
    │   ├── enrollment.routes.js
    │   └── admin.routes.js
    ├── middleware/
    │   └── auth.middleware.js    # JWT verify, requireAdmin, optionalAuth
    ├── auth/
    │   └── auth.js               # Auth helpers
    ├── api/
    │   └── routes.js             # Additional API utilities
    ├── database/
    │   └── schema.js             # DB schema reference
    └── seeds/
        └── seed-all.js           # Populate DB with sample data
```

---

## 🔌 API Endpoints

All API routes are prefixed with `/api/v1`.

### Auth — `/api/v1/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register a new student account | Public |
| POST | `/login` | Login & receive JWT | Public |
| GET | `/me` | Get current user profile | 🔒 User |
| PUT | `/profile` | Update user profile | 🔒 User |

### Courses — `/api/v1/courses`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all published courses | Public |
| GET | `/filters` | Get available filter options | Public |
| GET | `/:slug` | Get course by slug (with chapters) | Public / 🔒 User |
| POST | `/` | Create a course | 🔒 Admin |
| PUT | `/:id` | Update a course | 🔒 Admin |
| DELETE | `/:id` | Delete a course | 🔒 Admin |

### Chapters — `/api/v1/chapters`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/:id` | Get chapter content + quiz | Public / 🔒 User |
| POST | `/:id/quiz` | Submit quiz answers | 🔒 User |
| POST | `/` | Create a chapter | 🔒 Admin |

### Enrollments — `/api/v1`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/enroll/:courseId` | Enroll in a course | 🔒 User |
| GET | `/my/courses` | Get my enrolled courses & progress | 🔒 User |
| GET | `/my/certificates` | Get my earned certificates | 🔒 User |
| POST | `/my/certificate/:courseId` | Generate certificate on completion | 🔒 User |

### Admin — `/api/v1/admin`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/stats` | Platform-wide stats | 🔒 Admin |
| GET | `/activity` | Recent activity feed | 🔒 Admin |
| GET | `/users` | List all users | 🔒 Admin |
| POST | `/users` | Create a user | 🔒 Admin |
| PUT | `/users/:id` | Update a user | 🔒 Admin |
| DELETE | `/users/:id` | Delete a user | 🔒 Admin |
| GET | `/courses` | List all courses (incl. unpublished) | 🔒 Admin |
| POST | `/courses` | Create a course | 🔒 Admin |
| PATCH | `/courses/:id/publish` | Toggle publish status | 🔒 Admin |
| DELETE | `/courses/:id` | Delete a course | 🔒 Admin |

### Misc
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Server health check |

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

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment variables
```bash
# Copy the example env file
cp .env.example .env
```
Open `backend/.env` and fill in your values:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pragati
JWT_SECRET=your_super_secret_key_here
```

### 4. (Optional) Seed the database with sample data
```bash
npm run seed
```
This populates the database with sample courses, chapters, and an admin account.

### 5. Start the server
```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The app will be available at **[http://localhost:5000](http://localhost:5000)**

> The backend serves the frontend static files directly — no separate frontend server needed.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary — Indigo | `#4f46e5` |
| Secondary — Teal | `#0d9488` |
| Accent — Amber | `#f59e0b` |
| Background | `#f8fafc` |
| Font | Inter (Google Fonts) |

Light-themed, professional, warm — built to feel motivating for students.

---

## 🗺️ Roadmap

- [x] Landing page with path overview
- [x] About, Contact, Explore pages
- [x] Education levels & streams browsing
- [x] JWT Authentication (register / login)
- [x] Student & Admin dashboards
- [x] Course catalog with filters (stream, degree, difficulty)
- [x] Path Explorer (stream & education-level based)
- [x] Chapter viewer with Markdown rendering
- [x] MCQ quiz gate per chapter
- [x] Certificate generation on course completion
- [x] REST API (Express + MongoDB/Mongoose)
- [ ] PDF certificate download
- [ ] AI-powered personalized path recommendations
- [ ] Progressive Web App (PWA) support
- [ ] Payment gateway for premium courses

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

Made with ❤️ by [Suyash Tiwari](https://github.com/SuyashT0911)

*Pragati — Making every student's journey count.*

</div>
