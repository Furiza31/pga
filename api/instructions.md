You are a senior full-stack developer. I want you to build a complete web application for a **student association management platform**.

## 🎯 Goal:

The platform should allow administrators and members to:

- Manage association members
- Organize and view events
- Collaborate on projects
- Communicate via an internal forum

---

## 🔙 Back-end

- Language: Node.js
- Typing: TypeScript
- Framework: Express.js
- Database: PostgreSQL
- **No ORM** – use **raw SQL queries** only (via `pg` / `node-postgres`)
- Recommended structure: clean architecture (MVC or DDD-like)
- Authentication:
  - User registration & login
  - Role-based access: `admin`, `member`
  - JWT or secure cookie-based sessions
- Modules to implement:
  - `users`: CRUD, roles
  - `events`: create, view, update, delete
  - `projects`: assign members, track progress
  - `forum`: categories, threads, replies
- Security:
  - Password hashing with bcrypt
  - Middleware for authentication & authorization
  - Input validation (e.g. Zod or Joi)

## 🧪 Local Development

- Docker support (optional but welcome)
- Alternatively, a clear `README.md` with setup instructions
- Scripts to:
  - Initialize PostgreSQL schema (simple SQL migrations)
  - Run backend & frontend locally

---

## ✅ Optional Bonus Features

- Automatic membership renewal reminders (email or dashboard notification)
- Social media sharing for events
- Post-event feedback form for participants

---

Start by generating a clean project structure for both backend and frontend, then progressively implement each module. The code must be **clean, secure, modular, well-commented, and developer-friendly**.
