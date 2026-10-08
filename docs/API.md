# Project Management System - REST API Specification

This document details the REST API endpoints for the Project Management System backend. The API is consumed by both the React Web Client and the React Native (Expo) Mobile Client.

---

## 1. General Principles

### Base URL
- **Local Development**: `http://localhost:5000/api`
- **Production**: `https://<deployed-backend-url>/api`

### Health Check (Public)
- **`GET /api/health`**
  - **Purpose**: Verify backend uptime and deployment health.
  - **Response (200 OK)**:
    ```json
    {
      "status": "ok",
      "uptime": 124.52,
      "timestamp": "2026-10-06T14:28:25.103Z"
    }
    ```

### Authentication Header
Protected endpoints require a valid JSON Web Token (JWT) passed in the `Authorization` header using the Bearer scheme:
```http
Authorization: Bearer <your_jwt_token>
```

### Standard Response Envelope
All API responses follow a consistent envelope:

- **Success Response (200 OK / 201 Created)**:
  ```json
  {
    "data": { ... },
    "meta": { ... } // (Optional pagination metadata)
  }
  ```

- **Error Response (400 / 401 / 403 / 404 / 409 / 429 / 500)**:
  ```json
  {
    "message": "Human-readable description of error",
    "errors": [
      {
        "field": "fieldName",
        "message": "Specific field validation or constraint failure message"
      }
    ]
  }
  ```

### HTTP Status Code Usage
| Code | Meaning | When Returned |
|---|---|---|
| **200** | OK | Successful GET, PUT, or DELETE request |
| **201** | Created | Resource successfully created (User, Project, Task) |
| **400** | Bad Request | Validation failure on body, query, or path parameters |
| **401** | Unauthorized | Missing, malformed, invalid, or expired token |
| **404** | Not Found | Resource does not exist OR belongs to another tenant/user |
| **409** | Conflict | Unique constraint violation (e.g. duplicate email) |
| **429** | Too Many Requests | Rate limit exceeded on authentication endpoints |
| **500** | Internal Error | Unexpected server error |

### Enums Reference
- **ProjectStatus**: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`
- **TaskStatus**: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **Priority**: `LOW`, `MEDIUM`, `HIGH`

---

## 2. Authentication Endpoints (`/api/auth`)

### 2.1 Register New User
- **Method / Path**: `POST /api/auth/register`
- **Authentication**: None (Rate-limited: 10 requests / 15 min per IP)
- **Request Body**:
  ```json
  {
    "fullName": "Demo Candidate",
    "email": "demo@example.com",
    "password": "Password123!"
  }
  ```
- **Validation Rules**:
  - `fullName`: Required, trimmed, 2 to 100 characters.
  - `email`: Required, valid email format, converted to lowercase.
  - `password`: Required, 8 to 72 characters.
- **Success Response (201 Created)**:
  ```json
  {
    "data": {
      "user": {
        "id": "c1f7a0b2-3c81-4e78-9e12-4211a7837012",
        "fullName": "Demo Candidate",
        "email": "demo@example.com",
        "createdAt": "2026-10-06T14:30:00.000Z",
        "updatedAt": "2026-10-06T14:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure on input fields.
  - `409 Conflict`: If `email` already exists:
    ```json
    {
      "message": "An account with this email address already exists",
      "errors": [{ "field": "email", "message": "Email address is already in use" }]
    }
    ```
  - `429 Too Many Requests`: Rate limit exceeded.

### 2.2 Login User
- **Method / Path**: `POST /api/auth/login`
- **Authentication**: None (Rate-limited: 10 requests / 15 min per IP)
- **Request Body**:
  ```json
  {
    "email": "demo@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "data": {
      "user": {
        "id": "c1f7a0b2-3c81-4e78-9e12-4211a7837012",
        "fullName": "Demo Candidate",
        "email": "demo@example.com",
        "createdAt": "2026-10-06T14:30:00.000Z",
        "updatedAt": "2026-10-06T14:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Generic message for security (prevents user enumeration):
    ```json
    {
      "message": "Invalid email or password"
    }
    ```
  - `429 Too Many Requests`: Rate limit exceeded.

### 2.3 Logout User
- **Method / Path**: `POST /api/auth/logout`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### 2.4 Get Current User Profile
- **Method / Path**: `GET /api/auth/me`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "data": {
      "user": {
        "id": "c1f7a0b2-3c81-4e78-9e12-4211a7837012",
        "fullName": "Demo Candidate",
        "email": "demo@example.com",
        "createdAt": "2026-10-06T14:30:00.000Z",
        "updatedAt": "2026-10-06T14:30:00.000Z"
      }
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized` (`Token expired` / `Invalid token`).

---

## 3. Project Endpoints (`/api/projects`)

### 3.1 List All User Projects
- **Method / Path**: `GET /api/projects`
- **Authentication**: Required (`Bearer <token>`)
- **Query Parameters**:
  - `search` (optional string): Case-insensitive search on project name.
  - `status` (optional enum): `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`.
  - `sortBy` (optional string): `createdAt` (default) | `name` | `startDate` | `endDate` | `status`.
  - `order` (optional string): `desc` (default) | `asc`.
  - `page` (optional integer): Defaults to `1`.
  - `limit` (optional integer): Defaults to `50` (max `100`).
- **Success Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a",
        "name": "Mobile App Launch",
        "description": "Production release for client mobile app",
        "status": "IN_PROGRESS",
        "startDate": "2026-09-30T00:00:00.000Z",
        "endDate": "2026-11-05T00:00:00.000Z",
        "createdAt": "2026-09-30T10:00:00.000Z",
        "updatedAt": "2026-10-01T12:00:00.000Z",
        "userId": "c1f7a0b2-3c81-4e78-9e12-4211a7837012",
        "_count": {
          "tasks": 3
        }
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
  ```

### 3.2 Get Single Project by ID
- **Method / Path**: `GET /api/projects/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "data": {
      "id": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a",
      "name": "Mobile App Launch",
      "description": "Production release for client mobile app",
      "status": "IN_PROGRESS",
      "startDate": "2026-09-30T00:00:00.000Z",
      "endDate": "2026-11-05T00:00:00.000Z",
      "createdAt": "2026-09-30T10:00:00.000Z",
      "updatedAt": "2026-10-01T12:00:00.000Z",
      "userId": "c1f7a0b2-3c81-4e78-9e12-4211a7837012",
      "tasks": [
        {
          "id": "e4f80164-897f-4422-9218-e214d2ba7bb1",
          "name": "Design Figma Mockups",
          "description": "Complete all wireframes",
          "priority": "HIGH",
          "status": "COMPLETED",
          "dueDate": "2026-10-04T00:00:00.000Z",
          "createdAt": "2026-09-30T11:00:00.000Z",
          "updatedAt": "2026-10-04T16:00:00.000Z",
          "projectId": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a"
        }
      ],
      "_count": {
        "tasks": 1
      }
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: If project does not exist or belongs to another user.

### 3.3 Create Project
- **Method / Path**: `POST /api/projects`
- **Authentication**: Required (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Brand Identity Redesign",
    "description": "New logo, style guides, and design tokens",
    "status": "NOT_STARTED",
    "startDate": "2026-10-10",
    "endDate": "2026-11-20"
  }
  ```
- **Validation**:
  - `name`: Required, 1 to 150 characters.
  - `endDate` must be >= `startDate`.
- **Success Response (201 Created)**: Returns created project object.

### 3.4 Update Project
- **Method / Path**: `PUT /api/projects/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Request Body**: (Any subset of project fields to update)
  ```json
  {
    "status": "IN_PROGRESS",
    "description": "Updated project description"
  }
  ```
- **Success Response (200 OK)**: Returns updated project object.
- **Error Responses**: `400 Bad Request`, `404 Not Found`.

### 3.5 Delete Project
- **Method / Path**: `DELETE /api/projects/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Project and all associated tasks deleted successfully"
  }
  ```
- **Note**: Deleting a project cascades deletion of all tasks underneath it.

---

## 4. Task Endpoints (`/api/tasks`)

### 4.1 List Tasks
- **Method / Path**: `GET /api/tasks`
- **Authentication**: Required (`Bearer <token>`)
- **Query Parameters**:
  - `projectId` (optional UUID): Filter tasks belonging to a specific project.
  - `search` (optional string): Case-insensitive search on task name.
  - `status` (optional enum): `PENDING` | `IN_PROGRESS` | `COMPLETED`.
  - `priority` (optional enum): `LOW` | `MEDIUM` | `HIGH`.
  - `sortBy` (optional string): `createdAt` | `dueDate` | `priority` | `status` | `name`.
  - `order` (optional string): `desc` | `asc`.
  - `page`, `limit` (pagination).
- **Success Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "e4f80164-897f-4422-9218-e214d2ba7bb1",
        "name": "Setup Expo EAS Build",
        "description": "Android APK configuration",
        "priority": "HIGH",
        "status": "PENDING",
        "dueDate": "2026-10-12T00:00:00.000Z",
        "createdAt": "2026-10-06T10:00:00.000Z",
        "updatedAt": "2026-10-06T10:00:00.000Z",
        "projectId": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a",
        "project": {
          "id": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a",
          "name": "Mobile App Launch",
          "status": "IN_PROGRESS"
        }
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 50,
      "totalPages": 1
    }
  }
  ```

### 4.2 Get Task by ID
- **Method / Path**: `GET /api/tasks/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**: Returns single task object.
- **Error Responses**: `404 Not Found` (if not found or belonging to another user).

### 4.3 Create Task
- **Method / Path**: `POST /api/tasks`
- **Authentication**: Required (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "name": "Implement Biometric Auth",
    "description": "Add Fingerprint/FaceID login",
    "priority": "HIGH",
    "status": "PENDING",
    "dueDate": "2026-10-18T00:00:00.000Z",
    "projectId": "90e1bc91-236b-4e12-bdae-4cfdb6c5a31a"
  }
  ```
- **Validation**:
  - `name`: Required, 1 to 150 characters.
  - `projectId`: Required UUID (must belong to authenticated user, else `404`).
- **Success Response (201 Created)**: Returns created task.

### 4.4 Update Task (Edit, Change Status/Priority, Mark Completed)
- **Method / Path**: `PUT /api/tasks/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "status": "COMPLETED",
    "priority": "HIGH"
  }
  ```
- **Success Response (200 OK)**: Returns updated task.

### 4.5 Delete Task
- **Method / Path**: `DELETE /api/tasks/:id`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

---

## 5. Dashboard Endpoints (`/api/dashboard`)

### 5.1 Get User Dashboard Metrics
- **Method / Path**: `GET /api/dashboard`
- **Authentication**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "data": {
      "totalProjects": 3,
      "totalTasks": 8,
      "completedTasks": 3,
      "pendingTasks": 4,
      "projectsInProgress": 1
    }
  }
  ```

### Formal Metric Definitions:
| Key | Definition | Status Filter Applied |
|---|---|---|
| `totalProjects` | Total count of all projects owned by the authenticated user. | None |
| `totalTasks` | Total count of all tasks across all projects owned by the user. | None |
| `completedTasks` | Total count of tasks with status `COMPLETED`. | `status: 'COMPLETED'` |
| `pendingTasks` | Strictly tasks with status `PENDING` (excludes `IN_PROGRESS`). | `status: 'PENDING'` |
| `projectsInProgress` | Total count of projects with status `IN_PROGRESS`. | `status: 'IN_PROGRESS'` |
