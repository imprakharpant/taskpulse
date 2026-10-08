# MASTER PROMPT & SPECIFICATION: Full-Stack Project Management System (Web + Mobile + Backend)

> **Role & Purpose**: This document serves as the single source of truth, end-to-end execution guide, and master instruction prompt for building the complete **Project Management System** (Web, Mobile, and Backend) strictly adhering to the technical assessment specification.

---

## 1. GLOBAL SYSTEM CONTEXT & HARD RULES

```text
You are building an end-to-end Full-Stack Project Management System internship assessment.
Deliverables:
- ONE Node.js + Express REST API backend (Vanilla JavaScript, ES Modules or CommonJS, no TypeScript).
- ONE PostgreSQL database managed via Prisma ORM.
- ONE Web Frontend (React + Vite + Tailwind CSS) in /frontend (or /web).
- ONE Mobile App (React Native with Expo) in /mobile.
- Both web and mobile communicate with the EXACT SAME backend and database.
- A user registered on web can immediately log in on mobile and view/modify the exact same data.

STRICT CONSTRAINTS & CODING STANDARDS:
1. JavaScript Only: Use .js and .jsx files. Strictly no TypeScript.
2. Complete Files: Always provide 100% complete, copy-pasteable files without placeholders, ellipses (...), or "left as exercise".
3. Security & Auth:
   - Passwords must be hashed using bcrypt (cost factor 10-12). Plain-text passwords must never be stored, logged, or returned in API responses.
   - JWT authentication: Bearer tokens with expiration. Verify in auth middleware.
   - Resource Authorization / Ownership Isolation: Users can ONLY view, edit, or delete their own projects and tasks. Return 404 (Not Found) rather than 403 when querying resources belonging to another user to prevent resource enumeration.
   - Tasks derive ownership through their parent project (`task.project.userId == req.user.id`).
4. Robust Validation:
   - Validate ALL incoming request bodies, queries, and params on the backend using Zod.
   - Reject empty strings, whitespace-only strings, invalid enum values, and invalid dates.
   - Validate date logic: `endDate` >= `startDate`.
5. Error & Response Standardization:
   - Success format: `{ "data": ... }`
   - Failure format: `{ "message": "...", "errors": [{ "field": "...", "message": "..." }] }`
   - Explicit HTTP status codes: 200, 201, 400, 401, 404, 409, 429, 500.
6. Rate Limiting: Apply `express-rate-limit` strictly to auth endpoints (`/api/auth/register`, `/api/auth/login`).
7. Clean Architecture: Layered architecture: Route -> Middleware -> Controller -> Service -> Prisma.
8. Database Safety: Use Prisma ORM parameterized queries exclusively. No raw SQL concatenation.
9. Secrets & Config: Load all configuration from environment variables (.env). Provide comprehensive `.env.example` files. Never commit actual `.env` files.
```

---

## 2. PROJECT REPOSITORY STRUCTURE

```text
project-management-system/
├── README.md                      # Comprehensive guide (setup, live links, APK link, demo video, credentials)
├── .gitignore                     # Ignores node_modules, .env, build, dist, .expo, *.apk
├── docker-compose.yml             # Bonus: Local Postgres + Backend container
├── .github/
│   └── workflows/
│       └── ci.yml                 # Bonus: CI workflow (linting, tests)
├── docs/
│   ├── ER-diagram.png             # Normalized database entity-relationship diagram
│   ├── API.md                     # Exhaustive endpoint documentation with request/response schemas
│   └── postman_collection.json    # Complete API request test collection
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma          # Database models, relations, and enums
│   │   ├── migrations/            # Version-controlled migrations
│   │   └── seed.js                # Seed script with demo credentials & test datasets
│   └── src/
│       ├── server.js              # Server entry point & graceful shutdown
│       ├── app.js                 # Express app setup, CORS, Helmet, routes, error handlers
│       ├── config/
│       │   ├── env.js             # Validated environment variables (Zod)
│       │   ├── db.js              # PrismaClient singleton instance
│       │   └── logger.js          # Winston / Morgan logger
│       ├── routes/
│       │   ├── index.js           # Main router aggregator (/api)
│       │   ├── auth.routes.js     # /api/auth (register, login, logout, me)
│       │   ├── project.routes.js  # /api/projects
│       │   ├── task.routes.js     # /api/tasks
│       │   └── dashboard.routes.js# /api/dashboard
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── project.controller.js
│       │   ├── task.controller.js
│       │   └── dashboard.controller.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── project.service.js
│       │   ├── task.service.js
│       │   └── dashboard.service.js
│       ├── middleware/
│       │   ├── auth.js            # JWT verification & req.user injection
│       │   ├── validate.js        # Zod validator middleware for body, query, params
│       │   ├── rateLimiter.js     # Rate limiting for auth endpoints
│       │   ├── errorHandler.js    # Global centralized error handler
│       │   └── notFound.js        # 404 handler for unknown routes
│       ├── validators/
│       │   ├── auth.schema.js
│       │   ├── project.schema.js
│       │   └── task.schema.js
│       └── utils/
│           ├── ApiError.js        # Custom error class (statusCode, message, errors)
│           └── asyncHandler.js    # Wrapper for async controller methods
├── frontend/                      # Web Client (React + Vite + Tailwind CSS)
│   ├── package.json
│   ├── .env.example               # VITE_API_URL
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                # Single-page application rewrite config
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   ├── client.js          # Axios instance + interceptors (auth token, 401 redirect)
│       │   ├── auth.api.js
│       │   ├── projects.api.js
│       │   ├── tasks.api.js
│       │   └── dashboard.api.js
│       ├── context/
│       │   └── AuthContext.jsx    # Auth state, login, register, logout, session check
│       ├── hooks/
│       │   └── useDebounce.js     # Debounce hook for instant search queries
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   └── ProtectedRoute.jsx # Route guard redirecting unauthenticated users
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetail.jsx
│       │   └── NotFound.jsx
│       ├── components/
│       │   ├── layout/            # Navbar, Sidebar, Footer, PageWrapper
│       │   ├── common/            # Button, Input, Select, Modal, ConfirmDialog, Badge, Spinner, EmptyState
│       │   ├── dashboard/         # StatCard, RecentActivity
│       │   ├── projects/          # ProjectCard, ProjectFormModal
│       │   └── tasks/             # TaskItem, TaskFormModal, TaskFilters
│       └── utils/
│           ├── constants.js       # Status/Priority constants & styling badges
│           └── formatDate.js     # Date formatter utilities
├── mobile/                        # Mobile App (React Native Expo)
│   ├── package.json
│   ├── .env.example               # EXPO_PUBLIC_API_URL
│   ├── app.json
│   ├── eas.json                   # EAS build config for APK generation
│   ├── App.js                     # Root component with providers
│   └── src/
│       ├── api/
│       │   ├── client.js          # Axios instance with SecureStore token interceptor & offline catcher
│       │   ├── auth.api.js
│       │   ├── projects.api.js
│       │   ├── tasks.api.js
│       │   └── dashboard.api.js
│       ├── context/
│       │   ├── AuthContext.jsx    # Secure token storage & auth state
│       │   └── NetworkContext.jsx # NetInfo listener for offline detection
│       ├── navigation/
│       │   ├── RootNavigator.jsx
│       │   ├── AuthNavigator.jsx
│       │   ├── AppNavigator.jsx   # Bottom tab bar (Dashboard, Projects)
│       │   └── ProjectsStack.jsx  # Projects -> ProjectDetail -> TaskForm
│       ├── screens/
│       │   ├── LoginScreen.jsx
│       │   ├── RegisterScreen.jsx
│       │   ├── DashboardScreen.jsx
│       │   ├── ProjectsScreen.jsx
│       │   ├── ProjectDetailScreen.jsx
│       │   └── TaskFormScreen.jsx
│       ├── components/
│       │   ├── common/            # Header, OfflineBanner, LoadingScreen, EmptyState, Badge, Button, Input
│       │   ├── StatCard.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── TaskItem.jsx
│       │   └── FilterChips.jsx
│       ├── utils/
│       │   ├── secureStorage.js   # expo-secure-store wrappers (Android Keystore / iOS Keychain)
│       │   └── constants.js
│       └── theme.js               # Shared colors, typography, elevations
└── shared/                        # Shared Constants & Validation Schemas (Bonus)
    ├── constants.js
    └── schemas.js
```

---

## 3. RELATIONAL DATABASE DESIGN & PRISMA SCHEMA

### Entity Definitions & Schema:
```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProjectStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id           String    @id @default(uuid())
  fullName     String
  email        String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  projects     Project[]

  @@map("users")
}

model Project {
  id          String        @id @default(uuid())
  name        String
  description String?
  status      ProjectStatus @default(NOT_STARTED)
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@index([userId])
  @@map("projects")
}

model Task {
  id          String     @id @default(uuid())
  name        String
  description String?
  priority    Priority   @default(MEDIUM)
  status      TaskStatus @default(PENDING)
  dueDate     DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("tasks")
}
```

### Key Relational & Ownership Guarantees:
1. **Ownership Cascades**:
   - `User` deletes -> All linked `Project`s deleted (`onDelete: Cascade`).
   - `Project` deletes -> All linked `Task`s deleted (`onDelete: Cascade`).
2. **Implicit Task Ownership**:
   - Tasks do not need a redundant `userId` column. Every task query is scoped through its parent project:
     `where: { id: taskId, project: { userId: currentUserId } }`.
3. **Enum Consistency**:
   - Project statuses: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`
   - Task statuses: `PENDING`, `IN_PROGRESS`, `COMPLETED`
   - Task priorities: `LOW`, `MEDIUM`, `HIGH`

---

## 4. API SPECIFICATION & CONTRACT

### Standard Response Envelope:
- **Success (200 / 201)**:
  ```json
  {
    "data": { ... }
  }
  ```
- **Error (400, 401, 404, 409, 429, 500)**:
  ```json
  {
    "message": "Human-readable error description",
    "errors": [
      { "field": "email", "message": "Email is already in use" }
    ]
  }
  ```

### Complete Endpoints Table:

| HTTP Verb | Endpoint | Auth Required | Description / Request Body | Response Codes |
|---|---|---|---|---|
| `GET` | `/api/health` | No | Health check for uptime monitoring & deployment verification | 200 `{ "status": "ok" }` |
| `POST` | `/api/auth/register` | No (Rate-limited) | Body: `{ fullName, email, password }` | 201, 400, 409 |
| `POST` | `/api/auth/login` | No (Rate-limited) | Body: `{ email, password }` | 200, 400, 401 |
| `POST` | `/api/auth/logout` | Yes | Invalidate client token (client deletes from storage) | 200 |
| `GET` | `/api/auth/me` | Yes | Returns current authenticated user `{ id, fullName, email, createdAt }` | 200, 401 |
| `GET` | `/api/projects` | Yes | Query: `search`, `status`, `page`, `limit`, `sortBy`, `order` | 200 |
| `GET` | `/api/projects/:id` | Yes | Get single project with tasks & metrics. Must belong to user. | 200, 404 |
| `POST` | `/api/projects` | Yes | Body: `{ name, description, status, startDate, endDate }` | 201, 400 |
| `PUT` | `/api/projects/:id` | Yes | Body: Partial/full project update. Must belong to user. | 200, 400, 404 |
| `DELETE` | `/api/projects/:id` | Yes | Cascades project and all tasks. Must belong to user. | 200, 404 |
| `GET` | `/api/tasks` | Yes | Query: `projectId`, `search`, `status`, `priority`, `page`, `limit` | 200 |
| `GET` | `/api/tasks/:id` | Yes | Get single task. Must belong to user's project. | 200, 404 |
| `POST` | `/api/tasks` | Yes | Body: `{ name, description, priority, status, dueDate, projectId }` | 201, 400, 404 |
| `PUT` | `/api/tasks/:id` | Yes | Body: Partial/full task update or status change. | 200, 400, 404 |
| `DELETE` | `/api/tasks/:id` | Yes | Delete task. Must belong to user's project. | 200, 404 |
| `GET` | `/api/dashboard` | Yes | Returns aggregated stats for authenticated user | 200 |

### Dashboard Response Shape:
```json
{
  "data": {
    "totalProjects": 8,
    "totalTasks": 24,
    "completedTasks": 14,
    "pendingTasks": 6,
    "projectsInProgress": 3
  }
}
```
*(Definition: `pendingTasks` counts tasks with `status === 'PENDING'`. `completedTasks` counts `status === 'COMPLETED'`.)*

---

## 5. ESSENTIAL FRONTEND UX CRITERIA (WEB & MOBILE)

To impress evaluators and pass rigorous grading, the frontend **must not merely function**—it must feel production-grade:

### 1. The 4 Essential UI States on EVERY Data View:
- **Loading State**: Animated skeleton loaders or spinner. Never render a blank screen.
- **Error State**: Friendly error message with an actionable **"Retry"** button.
- **Empty State**: Illustrated/styled message (e.g., "No projects found") with a primary action button ("Create First Project").
- **Success State**: Clean, responsive presentation of data cards or tables.

### 2. Form Engineering & Validation:
- Use `react-hook-form` paired with `zod` schema resolvers.
- Instant, field-level inline error messages under respective inputs.
- Real-time client checks (e.g., `endDate >= startDate`).
- Map server 400/409 error responses directly onto corresponding form fields (e.g., "Email is already taken").
- Disable submit buttons during pending requests and display a loading spinner.

### 3. Authentication & Session Lifecycles:
- Axios request interceptor attaches `Authorization: Bearer <token>`.
- Axios response interceptor intercepts `401 Unauthorized`. If token expired, clear storage and route to login with a banner: *"Your session has expired. Please sign in again."*
- Route guards check session validity before mounting protected views.
- Immediate redirect from `/login` or `/register` to `/dashboard` if user is already authenticated.

### 4. Search & Filter UX:
- **Debounced Search**: 350ms debounce delay so keystrokes don't flood the API.
- **Composite Filtering**: Search query, status filter, and priority filter work simultaneously and harmoniously.
- Dedicated "Clear Filters" button when filters yield 0 results.

### 5. Cross-Platform Real-Time Parity:
- After creating, updating, or deleting any item on web, it updates immediate state.
- On mobile, `Pull-to-Refresh` (`RefreshControl`) allows immediate synchronization of data created on web.
- NetInfo integration on mobile displays an unobtrusive "No Internet Connection" banner with cached data or retry trigger.

---

## 6. SECURITY AUDIT CHECKLIST

- [x] **Password Protection**: Salted hash using `bcryptjs` (salt rounds 10+). Passwords never stored or logged in plain text.
- [x] **Secure Token Lifecycle**: Signed with HMAC SHA256 (`jsonwebtoken`), strict expiration (`JWT_EXPIRES_IN=1d` or `7d`), stored in `SecureStore` (Android Keystore / iOS Keychain) on mobile.
- [x] **Route Protection**: JWT middleware enforced across all non-public endpoints.
- [x] **Strict Tenant Isolation**: All Prisma queries enforce user ownership via `userId` or relation `project: { userId }`.
- [x] **Zero Resource Leakage**: Requesting non-owned resources returns 404 (Not Found) to prevent ID enumeration.
- [x] **Input Sanitization & Schema Validation**: Zod parses and sanitizes request bodies, query params, and route params.
- [x] **Injection Prevention**: Prisma ORM executes parameterized queries under the hood.
- [x] **Rate Limiting**: `express-rate-limit` prevents brute-force login/registration attempts.
- [x] **CORS & Headers**: `cors` configured with allowed origin whitelist; `helmet` applies essential security headers.
- [x] **Sanitized Error Responses**: Never leak internal database errors or stack traces to clients in production.

---

## 7. STEP-BY-STEP BUILD ORDER & PHASE ROADMAP

### PHASE 1: Backend Foundation, Middleware & Environment Validation
- Initialize `backend/package.json` with dependencies: `express`, `cors`, `helmet`, `morgan`, `winston`, `bcryptjs`, `jsonwebtoken`, `zod`, `express-rate-limit`, `dotenv`, `@prisma/client`.
- Dev dependencies: `prisma`, `nodemon`.
- Setup `src/config/env.js`: Validate all environment variables at startup using Zod (`PORT`, `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`) and fail fast if invalid.
- Setup `src/config/db.js` (PrismaClient singleton) and `src/config/logger.js` (Winston logger with Morgan request stream).
- Setup `src/utils/ApiError.js` (status code, message, error details) and `src/utils/asyncHandler.js`.
- Setup core middleware upfront:
  - `src/middleware/validate.js`: Generic Zod validator middleware for `req.body`, `req.query`, and `req.params`.
  - `src/middleware/notFound.js`: 404 handler for unmatched routes.
  - `src/middleware/errorHandler.js`: Centralized error handler converting ApiError, ZodError (400), Prisma errors (P2002 -> 409, P2025 -> 404), and JWT errors.
- Setup `src/app.js` with complete middleware stack: `helmet()`, `cors({ origin: allowedOrigins })`, `express.json({ limit: '10kb' })`, `morgan`, and health check route `GET /api/health`.
- Setup `src/server.js` listening on `PORT` with graceful shutdown handlers.

### PHASE 2: Database Modeling, Migrations, Seeding & ER Diagram Generation
- Create `prisma/schema.prisma` with models: `User`, `Project`, `Task` and enums: `ProjectStatus`, `TaskStatus`, `Priority`.
- Run migrations: `npx prisma migrate dev --name init`.
- Create `prisma/seed.js` with demo account:
  - Email: `demo@example.com`
  - Password: `Password123!`
  - 3 realistic projects with varied statuses and 8 linked tasks.
- Add npm script: `"seed": "node prisma/seed.js"` and verify data insertion.
- **Generate ER Diagram NOW (don't wait until the end)**: Export database schema diagram to `docs/ER-diagram.png` (using `prisma-dbml-generator` + dbdiagram.io, or draw.io). Once the migration is verified, the schema is final and this check is completed early.

### PHASE 3: Authentication & Authorization Engine
- Build `validators/auth.schema.js` with Zod:
  - `registerSchema`: `fullName` (trimmed, 2-100 chars), `email` (valid email, lowercase), `password` (min 8 chars, max 72 chars).
  - `loginSchema`: `email` (valid email), `password` (string).
- Build `middleware/rateLimiter.js`: Apply `express-rate-limit` strictly to `/api/auth/register` and `/api/auth/login` (max 10 attempts per 15 min per IP, returning 429).
- Build `services/auth.service.js`:
  - Password hashing via `bcryptjs` (salt factor 10-12).
  - JWT token generation (`jsonwebtoken`) with payload `{ sub: user.id }`.
  - Generic login failure error: Return identical generic message (`"Invalid email or password"`) for both unknown email and wrong password to prevent user enumeration.
- Build `middleware/auth.js`:
  - Verify Bearer token from `Authorization` header.
  - Specifically differentiate `TokenExpiredError` to return a distinct 401 error message: `{ "message": "Token expired" }` so web and mobile clients can reliably trigger session expiration flows.
  - Return 401 `{ "message": "Invalid token" }` for malformed/tampered tokens.
  - Attach `req.user = { id: decoded.sub }`.
- Build `controllers/auth.controller.js` and `routes/auth.routes.js`:
  - `POST /api/auth/register` (returns 201 `{ data: { user, token } }`).
  - `POST /api/auth/login` (returns 200 `{ data: { user, token } }`).
  - `POST /api/auth/logout` (returns 200 `{ message: "Logged out successfully" }`).
  - `GET /api/auth/me` (returns 200 `{ data: { user } }` without `passwordHash`).

### PHASE 4: Projects CRUD with Search & Filters
- Build `validators/project.schema.js`:
  - Create/Update validation: `name` (1-150 chars, trimmed), `description` (optional, max 2000), `status` enum (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`), `startDate` and `endDate` valid dates with constraint `endDate >= startDate`.
  - Query validation: `search` (string), `status` (enum), `page`, `limit`.
- Build `services/project.service.js`:
  - Strict ownership isolation: all queries scoped with `where: { userId: req.user.id }`.
  - Return `ApiError(404, 'Project not found')` for non-existent or other users' projects (never 403).
  - Case-insensitive search on project name: `name: { contains: search, mode: 'insensitive' }`.
- Build `controllers/project.controller.js` and mount `routes/project.routes.js` at `/api/projects`.

### PHASE 5: Tasks CRUD with Scoped Ownership
- Build `validators/task.schema.js`:
  - Validation: `name` (1-150 chars), `description` (optional), `priority` enum (`LOW`, `MEDIUM`, `HIGH`), `status` enum (`PENDING`, `IN_PROGRESS`, `COMPLETED`), `dueDate` valid date, `projectId` UUID.
- Build `services/task.service.js`:
  - Enforce ownership through the parent project: `where: { id: taskId, project: { userId: req.user.id } }`.
  - On create, verify parent project exists and belongs to user first; return 404 if not found.
  - Support status update, priority change, and marking complete (`status: COMPLETED`).
  - Cascading deletion handled at database level upon project deletion.
- Build `controllers/task.controller.js` and mount `routes/task.routes.js` at `/api/tasks`.

### PHASE 6: Dashboard Statistics Aggregation
- Define metrics precisely:
  - `totalProjects`: Count of all projects owned by user.
  - `totalTasks`: Count of all tasks under user's projects.
  - `completedTasks`: Count of tasks with `status === 'COMPLETED'`.
  - `pendingTasks`: Strictly defined as tasks with `status === 'PENDING'` (documented in `API.md`).
  - `projectsInProgress`: Count of projects with `status === 'IN_PROGRESS'`.
- Build `services/dashboard.service.js` executing all counts in parallel via `Promise.all`.
- Mount `routes/dashboard.routes.js` at `/api/dashboard`.
- Document `pendingTasks` and metric definitions explicitly in `docs/API.md`.

### PHASE 7: API Documentation, Live Deployment & Postman Testing
- Write exhaustive `docs/API.md`: Document every endpoint, parameters, request body, responses (success & error), status codes, and `pendingTasks` definition.
- Export complete Postman collection to `docs/postman_collection.json`.
- Deploy PostgreSQL database to Neon (or Supabase).
- Run production migration: `npx prisma migrate deploy` against the Neon database URL and run seed.
- Deploy backend to Render or Railway with build command `npm install && npx prisma generate` and start command `node src/server.js`.
- Set backend environment variables on host (`DATABASE_URL`, `JWT_SECRET`, etc.). Set `CORS_ORIGIN` to a placeholder (`http://localhost:5173`) until web is deployed.
- Verify live health route: `GET https://<deployed-backend-url>/api/health` returns `{ "status": "ok" }`.
- Execute and verify every Postman endpoint directly against the **live** deployed backend.

### PHASE 8: Web Frontend Foundation (React + Vite + Tailwind)
- Scaffold `frontend/` using Vite with React.
- Install dependencies: `axios`, `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, `lucide-react`.
- Configure Tailwind CSS.
- Build `src/api/client.js`:
  - Axios instance pointing to `import.meta.env.VITE_API_URL`.
  - Request interceptor: Automatically attaches `Authorization: Bearer <token>` from `localStorage`.
  - Response interceptor: On 401 error, if error message indicates token expired (or status is 401 outside login/register), clear storage and redirect to `/login?expired=1`.
  - Network error catcher: Friendly message ("Unable to connect to server").
- Build `src/context/AuthContext.jsx`: Provides `user`, `loading`, `login`, `register`, `logout`. On initial mount, calls `/api/auth/me` to validate session without flashing login screen.
- Build `src/routes/ProtectedRoute.jsx` and UI layout wrappers (Navbar, Sidebar).

### PHASE 9: Web Pages, Full UX States & Vercel Deployment
- Build `pages/Login.jsx` & `pages/Register.jsx`:
  - React Hook Form + Zod validation with inline field errors.
  - Map server errors (e.g., 409 duplicate email) to form fields.
  - Handle `?expired=1` with alert: *"Your session expired, please log in again."*
- Build `pages/Dashboard.jsx`: 5 stat cards with loading skeletons, error + retry state.
- Build `pages/Projects.jsx`:
  - Responsive card grid.
  - Debounced search by project name (350ms) + status filter + "Clear filters".
  - Create / Edit Project modal with date validation (`endDate >= startDate`).
  - Delete project with confirmation dialog.
  - Loading, error, empty ("No projects yet"), and no-filter-results states.
- Build `pages/ProjectDetail.jsx`:
  - Project header info + actions.
  - Task list with debounced search, status filter, and priority filter.
  - Create / Edit Task modal + Delete with confirmation dialog.
  - One-click mark as completed button/checkbox.
  - Status badges, priority badges, and visual highlight for overdue tasks (`dueDate < today` & not completed).
- Deploy web app to Vercel with `vercel.json` rewrite rule for SPA routing. Set `VITE_API_URL` to live backend URL.
- **CRITICAL BACKEND UPDATE**: Go back to Render/Railway and update `CORS_ORIGIN` with the live Vercel URL to avoid CORS blocks on production!

### PHASE 10: Mobile Foundation, Auth Screens & Early EAS Config
- Scaffold `mobile/` with Expo.
- Install dependencies: `expo-secure-store`, `@react-native-community/netinfo`, `react-native-screens`, `react-native-safe-area-context`, `@react-native-community/datetimepicker`, `axios`, `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`, `react-hook-form`, `zod`, `@hookform/resolvers`.
- Build `src/utils/secureStorage.js` using `expo-secure-store` (Android Keystore / iOS Keychain).
- Build `src/api/client.js`:
  - Reads token from `SecureStore`.
  - On 401 (e.g. "Token expired"), clears token and sets expired session flag so navigation resets to login with *"Session expired, please log in again"*.
  - Catches network failures (`!error.response`) and triggers offline handler.
- Build `src/context/NetworkContext.jsx` using NetInfo to track online/offline connectivity.
- Build `src/context/AuthContext.jsx` with secure token lifecycle.
- **Implement Mobile Auth Screens NOW**:
  - `screens/LoginScreen.jsx` & `screens/RegisterScreen.jsx` with form validation, inline errors, and loading state.
  - Verify mobile login works against the deployed backend.
- **Trigger Early EAS Build Check**:
  - Configure `eas.json` for APK preview build pointing to deployed backend URL.
  - Run initial `eas build -p android --profile preview` early so you don't wait in build queues or hit unexpected native config bugs at the deadline.

### PHASE 11: Mobile Screens, Gestures, Date Picker & Offline Polish
- Build Navigation:
  - RootNavigator: AuthStack (Login, Register) vs MainTabs (Dashboard, Projects).
  - ProjectsStack: ProjectsScreen -> ProjectDetailScreen -> TaskFormScreen.
- Build `screens/DashboardScreen.jsx`: 5 stat cards with `RefreshControl` (pull-to-refresh).
- Build `screens/ProjectsScreen.jsx`: `FlatList` with pull-to-refresh, status filter chips, and Project cards.
- Build `screens/ProjectDetailScreen.jsx`:
  - Task `FlatList` with pull-to-refresh.
  - Task search bar (debounced) + filter chips for status and priority.
  - Quick status/priority change and one-tap mark completed.
  - Delete task with native `Alert.alert` confirmation.
  - FAB button navigating to `TaskFormScreen`.
- Build `screens/TaskFormScreen.jsx`:
  - Inputs for task name, description, priority selector, status selector.
  - Native date picker (`@react-native-community/datetimepicker`) for `dueDate`.
  - Zod validation with field errors.
- Polish Mobile UX:
  - Add `OfflineBanner` component that pops up when internet drops, with Retry action.
  - Add Logout button with confirmation in header/settings.
  - Verify `SafeAreaView` and `KeyboardAvoidingView` across all screens.

### PHASE 12: Final APK Build, GitHub Release & Device Testing
- Rebuild APK with final code: `eas build -p android --profile preview`.
- Download the generated `.apk` file from Expo dashboard.
- Create a GitHub Release in the repository and attach `app.apk` as a release asset (backup in case EAS link expires).
- Install the APK on a physical Android phone:
  - Verify login with seeded user (`demo@example.com`).
  - Verify pull-to-refresh syncs with web in real-time.
  - Test airplane mode to verify offline banner.

### PHASE 13: README, Final Acceptance Tests & Submission Package
- Write comprehensive `README.md`:
  - Title, description, live links (Web, Backend `/api/health`, APK download, Demo Video).
  - Seeded demo credentials (`demo@example.com` / `Password123!`).
  - Tech stack table and architecture diagram with ER diagram preview.
  - Prerequisites and local installation instructions (backend, web, mobile).
  - How to run mobile against the deployed backend (`EXPO_PUBLIC_API_URL` / APK).
  - Environment variables reference table for all 3 apps.
  - Security practices summary and known limitations.
- Run Final Acceptance Testing:
  - Verify repo is **Public** in an incognito window.
  - Verify no secret `.env` files are tracked in git (`git status`, `git log -p | grep -i secret`).
  - Verify duplicate email registration returns 409.
  - Verify 404 isolation for cross-user project/task access.
  - Verify rate limiter blocks rapid brute force.
  - Record the 5-minute demo video following the script in Section 8.
- Reply to submission email with: GitHub repo URL, Web deployment URL, Backend deployment URL, Android APK link, and Demo video link.

---

## 8. DEMO VIDEO WALKTHROUGH SCRIPT (5 MINUTES)

1. **Introduction (0:00 - 0:30)**:
   - Brief greeting, show GitHub repo, point out architecture (single monorepo: `backend/`, `frontend/`, `mobile/`, `docs/`).
   - Mention tech stack: Node/Express, PostgreSQL via Prisma, React Vite, React Native Expo.
2. **Web App Walkthrough (0:30 - 2:00)**:
   - Register a new account on Web (demonstrate inline form validation).
   - View Dashboard: show 5 stats (0 total projects, 0 tasks).
   - Create a new project: "Mobile App Launch" with start & end dates.
   - Inside the project, create 2 tasks:
     - "Design Figma Mockups" (High priority, In Progress).
     - "Setup Expo EAS Build" (Medium priority, Pending).
   - Demonstrate search and filter by status & priority.
3. **Cross-Platform Synchronization & Mobile App (2:00 - 3:30)**:
   - Open mobile app (Android APK / Expo).
   - Log in with the **same** account registered on Web.
   - Show Dashboard updating with identical counts.
   - Navigate to Projects: open "Mobile App Launch".
   - Demonstrate `Pull-to-Refresh`: tasks instantly reflect.
   - On mobile, edit "Setup Expo EAS Build": change status to "Completed".
   - Return to Web, refresh or observe: status updates to "Completed" immediately.
4. **Security & Edge Case Verification (3:30 - 4:45)**:
   - Demonstrate rate-limiting by rapidly submitting login attempts (receives 429).
   - Demonstrate isolation: Log into demo user account, verify that Project ID from first user cannot be accessed (returns 404).
   - Demonstrate offline banner on mobile: toggle Airplane Mode, see friendly offline notice without crashing.
5. **Conclusion & Wrap-Up (4:45 - 5:00)**:
   - Conclude showing docs, ER diagram, and clean commit history.

---

## 9. READY-TO-USE INTERACTIVE PROMPT FOR EXECUTION

When you want to execute each phase with an AI assistant or proceed step-by-step, use this prompt structure:

```text
Proceed with PHASE <NUMBER>: <PHASE TITLE>.
Adhere strictly to MASTER_PROMPT_Project_Management_System.md:
- Language: JavaScript only (.js, .jsx).
- Output: 100% complete files with exact paths.
- Enforce strict security, Zod validation, and ownership isolation.
- Provide verification commands and tests at the end of the phase.
```
