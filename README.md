# Task Manager

A full-stack task management application built with **Angular 22** (signal-first, zoneless) and **NestJS** on **Neon PostgreSQL**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (standalone, zoneless, signals, Tailwind v4) |
| Backend | NestJS 11 (TypeORM, JWT auth, Swagger) |
| Database | Neon PostgreSQL (serverless) |
| Auth | JWT with bcrypt password hashing |

## Project Structure

```
├── apps/
│   ├── api/          # NestJS backend (port 3000)
│   └── web/          # Angular frontend (port 4200)
├── docs/
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 22+
- npm 10+

### Setup

```bash
# Install all dependencies
npm run install:all

# Start API (port 3000) and Web (port 4200) concurrently
npm start

# Or start separately:
npm run start:api   # http://localhost:3000/api
npm run start:web   # http://localhost:4200
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/profile | Yes | Get user profile |
| GET | /api/tasks | Yes | List tasks |
| GET | /api/tasks/:id | Yes | Get task by ID |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/:id | Yes | Update task |
| DELETE | /api/tasks/:id | Yes | Delete task |

Swagger docs: http://localhost:3000/api/docs

### Features

- ✅ User registration & JWT authentication
- ✅ Create, read, update, delete tasks
- ✅ Filter tasks by status (pending, in_progress, completed)
- ✅ Priority levels (low, medium, high)
- ✅ Due dates
- ✅ Dark-themed UI with Tailwind CSS v4
- ✅ Signal-first Angular architecture (zoneless)
- ✅ Swagger API documentation
- ✅ Neon PostgreSQL database
