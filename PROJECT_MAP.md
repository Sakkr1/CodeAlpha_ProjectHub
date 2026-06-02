# PROJECT_MAP — Project Management Tool (Trello/Asana-like)

> **Date**: 2026-06-01 | **Status**: COMPLETED — All Milestones + DnD Kanban

---

## [TECH_STACK]

### Core Platform
| Tech | Used Version | Purpose |
|------|-------------|---------|
| Node.js | **24.12.0** (env) / **26.2.0** (target) | Runtime |
| TypeScript | **6.0.3** | Language (strict mode) |
| MongoDB | **8.3.2** | Database |
| npm | 11.x | Package manager |

### Server (Runtime)
| Package | Version | Purpose |
|---------|---------|---------|
| Express | **5.2.1** | HTTP framework |
| Mongoose | **9.6.3** | ODM for MongoDB |
| socket.io | **4.8.3** | Real-time (task comments) |
| jsonwebtoken | ^9.x | JWT auth |
| bcryptjs | ^2.x | Password hashing |
| cors | ^2.x | CORS |
| dotenv | ^16.x | Env config |
| zod | ^3.x | Request validation |
| winston | ^3.x | Async logging |

### Client (Runtime)
| Package | Version | Purpose |
|---------|---------|---------|
| React | **19.2.6** | UI framework |
| react-router-dom | **7.16.0** | Client routing |
| zustand | **5.0.14** | State management (auth, projects, tasks, comments, toasts) |
| socket.io-client | **4.8.3** | Real-time client |
| @tanstack/react-query | ^5.x | Server state caching |
| tailwindcss | ^4.x | Utility-first CSS + dark mode |
| axios | ^1.x | HTTP client |
| @dnd-kit/core | ^10.x | Drag-and-drop Kanban |
| vite | ^6.x | Bundler & dev server |

### Dev Tools
| Package | Version | Purpose |
|---------|---------|---------|
| tsx | ^4.x | Run TS directly (dev) |
| vitest | ^3.x | Unit tests |
| eslint | ^9.x | Linting |
| prettier | ^3.x | Formatting |

---

## [SYSTEM_FLOW]

### User Journeys (Verifiable Goals — All Implemented)

```
[1] Auth ──> Register ──> Login ──> JWT issued
                │                      │
                └── password hashed ───┘

[2] Projects ──> List my projects ──> Create project ──> Edit/Delete project (cascade)

[3] Tasks ──> List tasks (by project) ──> Create task ──> Update status ──> Delete (cascade)

[4] Comments ──> View comments (realtime) ──> Post comment (realtime broadcast via Socket.IO)

[5] Theme ──> Toggle light/dark ──> Persisted to localStorage + user profile (PATCH /auth/theme)

[6] Explore ──> List all projects ──> View project (read-only) ──> Comment on tasks
```

### Data Flow

```
Client (React) ──axios──> Express API ──> Mongoose ──> MongoDB
                     │                        │
                     └── JWT middleware ──────┘

Client (Socket) ──socket.io──> Socket.IO Server ──> Room per task
                                    │
                                    └── Broadcast new comment to room
```

---

## [ARCHITECTURE]

```
project-management/
├── server/
│   ├── src/
│   │   ├── __tests__/              # 21 unit tests (5 files)
│   │   ├── config/
│   │   │   ├── env.ts              # Zod-validated env vars
│   │   │   └── db.ts               # Mongoose connection
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification middleware
│   │   │   └── error.ts            # Global error handler
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.model.ts    # User schema (bcrypt hashing)
│   │   │   │   ├── auth.routes.ts   # /register, /login, /me, /theme
│   │   │   │   ├── auth.controller.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── project/
│   │   │   │   ├── project.model.ts
│   │   │   │   ├── project.routes.ts
│   │   │   │   ├── project.controller.ts
│   │   │   │   └── project.service.ts  # Cascade delete tasks+comments
│   │   │   ├── task/
│   │   │   │   ├── task.model.ts
│   │   │   │   ├── task.routes.ts
│   │   │   │   ├── task.controller.ts
│   │   │   │   └── task.service.ts     # Cascade delete comments
│   │   │   └── comment/
│   │   │       ├── comment.model.ts
│   │   │       ├── comment.controller.ts
│   │   │       └── comment.service.ts
│   │   ├── socket/
│   │   │   └── index.ts            # Socket.IO init, JWT auth, rooms
│   │   ├── shared/
│   │   │   ├── logger.ts           # Winston async logger
│   │   │   ├── errors.ts           # AppError, NotFoundError, UnauthorizedError
│   │   │   └── socket.d.ts         # Socket.IO type declarations
│   │   ├── app.ts                  # Express app setup
│   │   └── server.ts               # Entry: HTTP + Socket.IO
│   ├── vitest.config.ts
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx              # Sticky header with avatar + branding
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ThemeToggle.tsx         # SVG icons, rotation animation
│   │   │   └── ui/
│   │   │       ├── Button.tsx          # loading spinner, active:scale, variants
│   │   │       ├── Input.tsx
│   │   │       ├── Modal.tsx           # backdrop-blur, scale-in animation
│   │   │       └── Toast.tsx           # Toast notification system (zustand)
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   └── auth.store.ts
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.tsx
│   │   │   │   ├── ProjectDetail.tsx
│   │   │   │   └── projects.store.ts
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx       # Column view (todo/in_progress/done)
│   │   │   │   └── tasks.store.ts
│   │   │   └── comments/
│   │   │       ├── CommentList.tsx    # Real-time via Socket.IO
│   │   │       └── comments.store.ts
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   └── useTheme.ts
│   │   ├── theme/
│   │   │   ├── index.css           # CSS variables + Tailwind dark variant
│   │   │   └── index.ts
│   │   ├── api/
│   │   │   └── client.ts           # Axios + JWT interceptor
│   │   ├── shared/
│   │   │   └── types.ts            # Shared DTO interfaces
│   │   ├── App.tsx                 # Router setup
│   │   ├── main.tsx                # Entry point
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── postcss.config.js
│   ├── vite.config.ts              # Dev proxy to :5000
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   └── types.ts                    # Server-side shared types (isomorphic)
└── PROJECT_MAP.md
```

### Database Schema (Implemented)

```
User { _id, email (unique), password (hashed), name, theme, createdAt, updatedAt }
Project { _id, name, description, owner (ref User), createdAt, updatedAt }
Task { _id, title, description, status (todo|in_progress|done), project (ref Project, indexed), createdBy (ref User), createdAt, updatedAt }
Comment { _id, content, task (ref Task, indexed), author (ref User), createdAt }
```

### API Endpoints (Implemented)

```
POST   /api/auth/register          → { user, token }
POST   /api/auth/login             → { user, token }
GET    /api/auth/me                → user (authenticated)
PATCH  /api/auth/theme             → user (authenticated)

GET    /api/projects               → Project[] (authenticated)
POST   /api/projects               → Project (authenticated)
GET    /api/projects/:id           → Project (authenticated, owner only)
PUT    /api/projects/:id           → Project (authenticated, owner only)
DELETE /api/projects/:id           → 204 (cascades tasks+comments)

GET    /api/projects/:pid/tasks    → Task[] (authenticated)
POST   /api/projects/:pid/tasks    → Task (authenticated)
PUT    /api/tasks/:id              → Task (authenticated)
DELETE /api/tasks/:id              → 204 (cascades comments)

GET    /api/tasks/:tid/comments    → Comment[] (authenticated)
POST   /api/tasks/:tid/comments    → Comment (authenticated)
DELETE /api/comments/:id           → 204 (authenticated, own comment only)

GET    /api/projects/explore         → Project[] (authenticated, all users)
GET    /api/projects/explore/:id     → Project (authenticated, public view)
```

### Socket.IO Events (Implemented)

```
Client → Server:
  join-task:{taskId}       # Join room
  leave-task:{taskId}      # Leave room
  comment:new              # { taskId, content }

Server → Client (room):
  comment:created          # { comment } — broadcast to task room
```

---

## [ORPHANS & PENDING]

| Item | Status | Notes |
|------|--------|-------|
| Bugfix: raw emoji escape | ✅ **FIXED** | `\ud83d\udcc1` in JSX text was literal text; wrapped in `{}` expression so JavaScript interprets surrogate pair |
| Server compilation | ✅ **VERIFIED** | `tsc --noEmit` + `tsc` clean |
| Client compilation | ✅ **VERIFIED** | `tsc --noEmit` + `vite build` clean |
| Unit tests | ✅ **PASSING** | 26 tests across 5 files |
| Project delete cascade | ✅ **IMPLEMENTED** | Deletes associated tasks + comments |
| Task delete cascade | ✅ **IMPLEMENTED** | Deletes associated comments |
| UI/UX overhaul | ✅ **COMPLETED** | See UI/UX improvements below |
| CI/CD pipeline | ❌ NOT PLANNED | Out of scope |
| E2E tests | ❌ NOT PLANNED | Out of scope |
| Docker setup | ❌ NOT PLANNED | Out of scope |
| Password reset | ❌ NOT PLANNED | Out of scope |
| Pagination | ❌ NOT PLANNED | Out of scope |
| Drag-and-drop Kanban | ✅ **IMPLEMENTED** | Replaced checkbox with @dnd-kit/core DnD. Fixes: `closestCorners` collision detection (pointer-based), removed `translate3d` transform from dragged card (was creating double-card effect with `DragOverlay`), removed unused `index` prop. Bugfix: PUT URL was `/tasks/:id` but server route is `/projects/:pid/tasks/:id` — missing `projectId` segment caused 404 → "Failed to move task" toast |
| Hidden buttons → always visible | ✅ **DONE** | Removed `opacity-0 hover:opacity-100` / `opacity-0 group-hover:opacity-100` from task delete `×`, project card "Delete", and project "Edit" buttons. Removed orphaned `group` classes. |
| Homepage navigation added | ✅ **DONE** | Login/Register "P" logo now clickable → `/`. Explore page and detail each show "Home" button. All pages inside Layout inherit "ProjectHub" header link. |
| console.* removed from source | ✅ **DONE** | Replaced `console.error` in `env.ts` with `process.stderr.write`. Zero `console.*` calls remain in source code. |
| README.md created | ✅ **DONE** | Comprehensive project README covering features, tech stack, setup, API endpoints, architecture, and conventions. Notes the app is for laptops/computers only. |
| Explore Projects page | ✅ **IMPLEMENTED** | `/explore` lists all users' projects; `/explore/:id` shows read-only Kanban with commenting via `TaskList readOnly` prop |
| File attachments | ❌ NOT PLANNED | Out of scope |
| Email notifications | ❌ NOT PLANNED | Out of scope |

---

## [SAFE LOGGING STRATEGY]

- **Library**: winston (async, non-blocking)
- **Levels**: `error`, `warn`, `info` (configurable via NODE_ENV)
- **Transports**: Console (colorized in dev, JSON in prod)
- **Format**: Timestamped JSON logs
- **Performance**: Fire-and-forget; never awaited in request path
- **Error handler**: Catches all unhandled errors, logs via winston

---

## [UI/UX IMPROVEMENTS]

| Area | Before | After |
|------|--------|-------|
| **Global styles** | Plain Tailwind, no custom animations | CSS variables for all colors, `animate-fade-in`, `animate-scale-in`, `animate-slide-up`, custom scrollbar, `::selection`, `*:focus-visible` |
| **Theme toggle** | Raw emoji (🌙/☀️) | SVG icons (moon/sun) with 180° rotation transition |
| **Button** | Plain, no loading state | `loading` spinner prop, `active:scale-[0.97]` press effect, `shadow-sm`/`shadow-md` on hover, focus ring |
| **Modal** | `bg-black/50` overlay, no animation | `backdrop-blur-sm`, `animate-scale-in` entrance, body scroll lock, close button hover state |
| **Toast** | None | Zustand-based toast system with `success`/`error`/`info` variants, auto-dismiss after 3.5s, slide-up animation |
| **Layout header** | Bare text "Project Manager", plain logout link | Brand logo (P icon), "ProjectHub" branding, user avatar circle with initial, sticky header with backdrop blur |
| **Login/Register** | Plain card, no loading, no feedback | Brand logo above form, subtitle, loading spinner on submit, `animate-scale-in` card entrance |
| **Project list** | Flat cards, inline delete without confirm, no loading | Skeleton loading shimmer, hover border highlight, grouped delay animation (50ms stagger), delete confirmation modal, project count, empty state with icon |
| **Project detail** | Static view, no edit | Inline editing for name + description with save/cancel, back arrow icon |
| **Task list** | Plain columns, arrow advance, no confirm, no progress | Status badges (`warning`/`accent`/`success` colors with light backgrounds), drag-and-drop between columns, progress bar with percentage, delete confirmation modal, skeleton loading, staggered card animation, strikethrough for done tasks |
| **Comment list** | `text-xs` cramped, bare input with "Send" link | Avatar circles with initials, timestamp display, "Live" indicator with pulsing dot (when socket connected), styled Send button, improved spacing |

---

## [MILESTONE VERIFICATION]

| Milestone | Verification Method | Result |
|-----------|-------------------|--------|
| **M1**: Scaffold | `tsc --noEmit` + `vite build` | ✅ Both compile/bundle |
| **M2**: Auth | Unit tests (5), code inspection | ✅ JWT + bcrypt + Zod validation |
| **M3**: Projects | Unit tests (5), cascade verified | ✅ CRUD + cascade delete |
| **M4**: Tasks | Unit tests (7), cascade verified | ✅ CRUD + DnD status change + cascade |
| **M5**: Comments | Unit tests (3) | ✅ CRUD |
| **M6**: Realtime | Code inspection (Socket.IO rooms) | ✅ join/leave/comment:new/created |
| **M7**: Theme | Code inspection (CSS vars + PATCH) | ✅ localStorage + API persistence |
| **Total Tests** | Vitest | ✅ **26/26 passing** |

---

## How to Run

```bash
# Server (requires MongoDB running on localhost:27017)
cd server
cp .env.example .env    # edit as needed
npm install
npm run dev             # tsx watch, port 5000

# Client
cd client
npm install
npm run dev             # Vite dev server, port 3000 (proxies /api to 5000)

# Tests
cd server && npx vitest run    # 26 tests
```
