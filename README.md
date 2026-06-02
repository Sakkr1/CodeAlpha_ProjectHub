# Project Management Tool

A full-stack Trello/Asana-like project management web application with drag-and-drop Kanban boards, real-time commenting, light/dark theme, and an explore page to browse other users' projects.

> **Platform**: This application is designed for laptops and computers only. It is not optimized for mobile devices or tablets.

---

## Features

- **Authentication** – Register, login, and session management with JWT tokens. Passwords hashed with bcrypt.
- **Project Management** – Create, edit, and delete projects. Cascade deletion removes all associated tasks and comments.
- **Task Kanban Board** – Drag-and-drop tasks between To Do, In Progress, and Done columns using `@dnd-kit/core`. Click a task to expand and view or post comments.
- **Real-Time Comments** – Socket.IO broadcasts new comments instantly to all users viewing the same task.
- **Explore Page** – Browse projects created by other users in read-only mode. You can still expand tasks and post comments.
- **Theme Toggle** – Switch between light and dark mode. Preference is persisted to localStorage and the user profile.
- **Toast Notifications** – Success and error toasts for all CRUD operations and real-time events.

---

## Tech Stack

### Server
| Package | Version |
|---------|---------|
| Node.js | 24.12.0+ |
| TypeScript | 6.0.3 |
| Express | 5.2.1 |
| Mongoose | 9.6.3 |
| Socket.IO | 4.8.3 |
| jsonwebtoken | ^9.x |
| bcryptjs | ^2.x |
| zod | ^3.x |
| winston | ^3.x |

### Client
| Package | Version |
|---------|---------|
| React | 19.2.6 |
| TypeScript | 6.0.3 |
| react-router-dom | 7.16.0 |
| zustand | 5.0.14 |
| tailwindcss | ^4.x |
| axios | ^1.x |
| @dnd-kit/core | ^10.x |
| Socket.IO Client | 4.8.3 |
| Vite | ^6.x |

### Database
- **MongoDB** 8.3.2

---

## Getting Started

### Prerequisites

- Node.js 24.12.0 or later
- npm 11.x
- MongoDB 8.3.2 running on `localhost:27017`

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd project-management

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configuration

The server uses a `.env` file. Defaults are suitable for development:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `MONGODB_URI` | mongodb://localhost:27017/project-mgmt | MongoDB connection string |
| `JWT_SECRET` | dev-secret-change-in-production | Secret key for JWT signing (min 8 chars) |
| `NODE_ENV` | development | Environment mode |

### Running

```bash
# Terminal 1 — Start the server
cd server
npx tsx src/server.ts

# Terminal 2 — Start the client
cd client
npm run dev
```

The client dev server runs on `http://localhost:3000` and proxies `/api` and `/socket.io` to the server on port 5000.

### Tests

```bash
cd server
npx vitest run
```

26 tests across 5 test files covering validation schemas, error classes, and API behavior.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user profile |
| PATCH | `/api/auth/theme` | Update theme preference |
| GET | `/api/projects` | List own projects |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get project detail |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project (cascade) |
| GET | `/api/projects/explore` | List all projects |
| GET | `/api/projects/explore/:id` | Get any project (public view) |
| GET | `/api/projects/:pid/tasks` | List tasks in project |
| POST | `/api/projects/:pid/tasks` | Create a task |
| PUT | `/api/projects/:pid/tasks/:id` | Update a task |
| DELETE | `/api/projects/:pid/tasks/:id` | Delete a task (cascade) |
| GET | `/api/tasks/:tid/comments` | List comments on a task |
| POST | `/api/tasks/:tid/comments` | Post a comment |
| DELETE | `/api/comments/:id` | Delete own comment |

---

## Architecture Overview

```
project-management/
├── server/
│   ├── src/
│   │   ├── config/          # Environment validation + DB connection
│   │   ├── middleware/      # JWT authentication + error handling
│   │   ├── modules/         # Feature modules (auth, project, task, comment)
│   │   │   └── each module has model, routes, controller, service
│   │   ├── socket/          # Socket.IO setup with JWT auth and rooms
│   │   └── shared/          # Logger, error classes, type declarations
│   └── __tests__/           # Vitest unit tests
├── client/
│   ├── src/
│   │   ├── components/      # Layout, theme toggle, UI primitives
│   │   ├── features/        # Page-level feature modules
│   │   ├── api/             # Axios client with interceptors
│   │   ├── hooks/           # Socket and theme hooks
│   │   └── shared/          # TypeScript type definitions
│   └── vite.config.ts       # Dev proxy config
└── PROJECT_MAP.md           # Internal developer documentation
```

---

## Project Structure Conventions

- **Feature-based modules** – Each domain (auth, project, task, comment) is self-contained with model, routes, controller, and service files.
- **No micro-files** – Shared utilities are kept in a single `shared/` directory only for genuinely reused code.
- **CSS** – Tailwind v4 with CSS `@layer` utilities. Dark mode is handled via Tailwind's `dark:` variants and CSS custom properties.
- **State Management** – Zustand stores for client-side state (auth, projects, tasks, comments, toasts). React Query available for server state caching.
- **Real-Time** – Socket.IO namespaces and rooms per task. Comments broadcast instantly to all connected clients viewing the same task.

---

## License

MIT
