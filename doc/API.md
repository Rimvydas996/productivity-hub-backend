# 🔌 API Documentation

Complete reference for all REST API endpoints.

---

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.productivityhub.com/api
```

## Authentication

All endpoints (except `/auth/signup` and `/auth/login`) require JWT token:

```
Authorization: Bearer <your_jwt_token>
```

---

## Response Format

### Success Response (2xx)

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    ...
  },
  "message": "Operation successful"
}
```

### Error Response (4xx, 5xx)

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {
    "email": "Email is required"
  }
}
```

---

## 🔐 Authentication Endpoints

### `POST /auth/signup`

Register a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "workspaces": [],
      "settings": {
        "theme": "light",
        "notificationEnabled": true
      },
      "createdAt": "2025-11-27T10:00:00Z"
    }
  },
  "message": "User registered successfully"
}
```

**Errors:**

- `400` - Email already exists
- `400` - Invalid email format
- `400` - Password too short (min 8 chars)

---

### `POST /auth/login`

Authenticate user and receive JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "workspaces": ["ws_1", "ws_2"],
      "settings": {
        "theme": "light",
        "notificationEnabled": true
      }
    }
  },
  "message": "Login successful"
}
```

**Errors:**

- `401` - Invalid email or password
- `404` - User not found

---

### `POST /auth/logout`

Invalidate user session.

**Request:** (no body)

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### `POST /auth/refresh`

Get a new JWT token using existing token.

**Request:** (no body, token in header)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed successfully"
}
```

---

## 👤 User Endpoints

### `GET /users/me`

Get current logged-in user profile.

**Request:** (no body)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "workspaces": ["ws_1", "ws_2"],
    "settings": {
      "theme": "light",
      "notificationEnabled": true
    },
    "createdAt": "2025-11-27T10:00:00Z"
  }
}
```

---

### `GET /users/:id`

Get user profile by ID.

**Request:** (no body)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_456",
    "email": "other@example.com",
    "name": "Jane Smith",
    "createdAt": "2025-11-20T08:00:00Z"
  }
}
```

**Errors:**

- `404` - User not found

---

### `PATCH /users/:id`

Update user profile (must be own profile).

**Request:**

```json
{
  "name": "John Updated",
  "settings": {
    "theme": "dark",
    "notificationEnabled": false
  }
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Updated",
    "settings": {
      "theme": "dark",
      "notificationEnabled": false
    }
  }
}
```

**Errors:**

- `403` - Unauthorized to update this user
- `404` - User not found

---

### `DELETE /users/:id`

Delete user account (must be own account).

**Request:** (no body)

**Response (200):**

```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

**Errors:**

- `403` - Unauthorized to delete this user
- `404` - User not found

---

## 🗂️ Workspace Endpoints

### `GET /workspaces`

Get all workspaces for current user.

**Query Parameters:**

- `limit` (optional): Number of workspaces per page (default: 20)
- `page` (optional): Page number (default: 1)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "ws_1",
      "name": "Project Alpha",
      "members": ["user_123", "user_456"],
      "admins": ["user_123"],
      "createdAt": "2025-11-20T10:00:00Z",
      "updatedAt": "2025-11-27T15:30:00Z"
    },
    {
      "id": "ws_2",
      "name": "Project Beta",
      "members": ["user_123"],
      "admins": ["user_123"],
      "createdAt": "2025-11-25T09:00:00Z",
      "updatedAt": "2025-11-25T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 20
  }
}
```

---

### `POST /workspaces`

Create a new workspace.

**Request:**

```json
{
  "name": "My New Project"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "ws_3",
    "name": "My New Project",
    "members": ["user_123"],
    "admins": ["user_123"],
    "createdAt": "2025-11-27T16:00:00Z",
    "updatedAt": "2025-11-27T16:00:00Z"
  },
  "message": "Workspace created successfully"
}
```

**Errors:**

- `400` - Name is required
- `400` - Workspace name already exists

---

### `GET /workspaces/:id`

Get workspace details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "ws_1",
    "name": "Project Alpha",
    "members": [
      {
        "id": "user_123",
        "email": "user@example.com",
        "name": "John Doe"
      },
      {
        "id": "user_456",
        "email": "other@example.com",
        "name": "Jane Smith"
      }
    ],
    "admins": ["user_123"],
    "taskStats": {
      "total": 25,
      "todo": 10,
      "inProgress": 8,
      "done": 7
    },
    "createdAt": "2025-11-20T10:00:00Z"
  }
}
```

**Errors:**

- `404` - Workspace not found
- `403` - Not a member of this workspace

---

### `PATCH /workspaces/:id`

Update workspace (admin only).

**Request:**

```json
{
  "name": "Project Alpha Updated"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "ws_1",
    "name": "Project Alpha Updated",
    ...
  }
}
```

**Errors:**

- `404` - Workspace not found
- `403` - Only admins can update workspace

---

### `DELETE /workspaces/:id`

Delete workspace (admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Workspace deleted successfully"
}
```

**Errors:**

- `404` - Workspace not found
- `403` - Only admins can delete workspace

---

### `POST /workspaces/:id/members`

Add member to workspace (admin only).

**Request:**

```json
{
  "userId": "user_789",
  "role": "member"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "ws_1",
    "members": ["user_123", "user_456", "user_789"],
    "admins": ["user_123"]
  },
  "message": "Member added successfully"
}
```

**Errors:**

- `404` - Workspace or user not found
- `403` - Only admins can add members
- `400` - User already a member

---

### `DELETE /workspaces/:id/members/:userId`

Remove member from workspace (admin only).

**Response (200):**

```json
{
  "success": true,
  "message": "Member removed successfully"
}
```

**Errors:**

- `404` - Workspace or member not found
- `403` - Only admins can remove members
- `400` - Cannot remove workspace owner

---

## ✅ Task Endpoints

### `GET /tasks`

Get tasks (filtered by workspace, status, assigned user, etc.).

**Query Parameters:**

- `workspaceId` (required): Workspace ID
- `status` (optional): `todo`, `in-progress`, `done`, `late`
- `assignedTo` (optional): User ID
- `priority` (optional): `low`, `medium`, `high`
- `tags` (optional): Comma-separated tags
- `sortBy` (optional): `dueDate`, `priority`, `createdAt` (default: `createdAt`)
- `sortOrder` (optional): `asc`, `desc` (default: `desc`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "task_1",
      "workspaceId": "ws_1",
      "title": "Design Homepage",
      "description": "Create mockups for homepage",
      "status": "in-progress",
      "priority": "high",
      "tags": ["design", "frontend"],
      "dueDate": "2025-12-05T18:00:00Z",
      "createdBy": "user_123",
      "assignedTo": "user_456",
      "repeat": {
        "frequency": "none"
      },
      "attachments": ["file_1", "file_2"],
      "comments": [
        {
          "userId": "user_123",
          "text": "Started working on this",
          "createdAt": "2025-11-26T10:30:00Z"
        }
      ],
      "createdAt": "2025-11-20T10:00:00Z",
      "updatedAt": "2025-11-27T14:00:00Z",
      "completedAt": null
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20
  }
}
```

---

### `POST /tasks`

Create a new task.

**Request:**

```json
{
  "workspaceId": "ws_1",
  "title": "Fix login bug",
  "description": "User cannot login with email containing +",
  "priority": "high",
  "dueDate": "2025-12-01T18:00:00Z",
  "assignedTo": "user_456",
  "tags": ["bug", "backend"],
  "repeat": {
    "frequency": "none"
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "task_2",
    "workspaceId": "ws_1",
    "title": "Fix login bug",
    "description": "User cannot login with email containing +",
    "status": "todo",
    "priority": "high",
    "tags": ["bug", "backend"],
    "dueDate": "2025-12-01T18:00:00Z",
    "createdBy": "user_123",
    "assignedTo": "user_456",
    "repeat": { "frequency": "none" },
    "attachments": [],
    "comments": [],
    "createdAt": "2025-11-27T16:00:00Z",
    "updatedAt": "2025-11-27T16:00:00Z",
    "completedAt": null
  },
  "message": "Task created successfully"
}
```

**Errors:**

- `400` - Missing required fields
- `404` - Workspace or assigned user not found
- `403` - Not a member of this workspace

---

### `GET /tasks/:id`

Get task details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "task_1",
    "workspaceId": "ws_1",
    "title": "Design Homepage",
    "description": "Create mockups for homepage",
    "status": "in-progress",
    "priority": "high",
    "tags": ["design", "frontend"],
    "dueDate": "2025-12-05T18:00:00Z",
    "createdBy": {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "assignedTo": {
      "id": "user_456",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "repeat": { "frequency": "none" },
    "attachments": [
      {
        "id": "file_1",
        "filename": "mockup.pdf",
        "url": "https://s3.amazonaws.com/...",
        "size": 2048,
        "mimeType": "application/pdf"
      }
    ],
    "comments": [
      {
        "userId": "user_123",
        "userName": "John Doe",
        "text": "Started working on this",
        "createdAt": "2025-11-26T10:30:00Z"
      }
    ],
    "createdAt": "2025-11-20T10:00:00Z",
    "updatedAt": "2025-11-27T14:00:00Z",
    "completedAt": null
  }
}
```

**Errors:**

- `404` - Task not found
- `403` - Not a member of task's workspace

---

### `PATCH /tasks/:id`

Update task.

**Request:**

```json
{
  "status": "done",
  "priority": "medium",
  "assignedTo": "user_789",
  "dueDate": "2025-12-10T18:00:00Z",
  "tags": ["design", "frontend", "urgent"]
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "task_1",
    "status": "done",
    "priority": "medium",
    "assignedTo": "user_789",
    "dueDate": "2025-12-10T18:00:00Z",
    "tags": ["design", "frontend", "urgent"],
    "completedAt": "2025-11-27T16:30:00Z",
    "updatedAt": "2025-11-27T16:30:00Z",
    ...
  }
}
```

**Errors:**

- `404` - Task not found
- `403` - Only task creator or assignee can update

---

### `DELETE /tasks/:id`

Delete task.

**Response (200):**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Errors:**

- `404` - Task not found
- `403` - Only task creator can delete

---

### `POST /tasks/:id/comments`

Add comment to task.

**Request:**

```json
{
  "text": "I'll start on this tomorrow"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "task_1",
    "comments": [
      {
        "id": "comment_1",
        "userId": "user_123",
        "userName": "John Doe",
        "text": "I'll start on this tomorrow",
        "createdAt": "2025-11-27T17:00:00Z"
      }
    ]
  }
}
```

**Errors:**

- `404` - Task not found
- `403` - Not a member of task's workspace

---

### `DELETE /tasks/:id/comments/:commentId`

Delete comment.

**Response (200):**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

**Errors:**

- `404` - Task or comment not found
- `403` - Only comment author can delete

---

## 📝 Notes Endpoints

### `GET /notes`

Get all notes.

**Query Parameters:**

- `workspaceId` (optional): Filter by workspace
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "note_1",
      "userId": "user_123",
      "workspaceId": "ws_1",
      "title": "Meeting Notes",
      "content": "Discussed quarterly goals...",
      "createdAt": "2025-11-27T10:00:00Z",
      "updatedAt": "2025-11-27T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

---

### `POST /notes`

Create a new note.

**Request:**

```json
{
  "title": "Important Meeting",
  "content": "Discussed project timeline and deadlines",
  "workspaceId": "ws_1"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "note_2",
    "userId": "user_123",
    "workspaceId": "ws_1",
    "title": "Important Meeting",
    "content": "Discussed project timeline and deadlines",
    "createdAt": "2025-11-27T17:00:00Z",
    "updatedAt": "2025-11-27T17:00:00Z"
  }
}
```

---

### `GET /notes/:id`

Get note details.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "note_1",
    "userId": "user_123",
    "workspaceId": "ws_1",
    "title": "Meeting Notes",
    "content": "Discussed quarterly goals...",
    "createdAt": "2025-11-27T10:00:00Z",
    "updatedAt": "2025-11-27T10:00:00Z"
  }
}
```

---

### `PATCH /notes/:id`

Update note.

**Request:**

```json
{
  "title": "Updated Meeting Notes",
  "content": "Discussed quarterly goals and deliverables..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "note_1",
    "title": "Updated Meeting Notes",
    "content": "Discussed quarterly goals and deliverables...",
    "updatedAt": "2025-11-27T17:30:00Z",
    ...
  }
}
```

---

### `DELETE /notes/:id`

Delete note.

**Response (200):**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

## 📊 Activity Log Endpoints

### `GET /activities/workspace/:workspaceId`

Get activity log for workspace.

**Query Parameters:**

- `limit` (optional): Items per page (default: 50)
- `page` (optional): Page number

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "activity_1",
      "workspaceId": "ws_1",
      "userId": "user_123",
      "userName": "John Doe",
      "action": "task_created",
      "targetType": "task",
      "targetId": "task_1",
      "targetName": "Design Homepage",
      "createdAt": "2025-11-27T16:00:00Z"
    },
    {
      "id": "activity_2",
      "workspaceId": "ws_1",
      "userId": "user_456",
      "userName": "Jane Smith",
      "action": "task_updated",
      "targetType": "task",
      "targetId": "task_1",
      "changes": {
        "status": "todo → in-progress"
      },
      "createdAt": "2025-11-27T14:30:00Z"
    }
  ]
}
```

---

### `GET /activities/task/:taskId`

Get activity log for specific task.

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "activity_1",
      "userId": "user_123",
      "action": "task_created",
      "createdAt": "2025-11-27T16:00:00Z"
    },
    {
      "id": "activity_2",
      "userId": "user_456",
      "action": "task_updated",
      "changes": { "status": "todo → in-progress" },
      "createdAt": "2025-11-27T14:30:00Z"
    }
  ]
}
```

---

## 🔔 Notifications Endpoints

### `GET /notifications`

Get user notifications.

**Query Parameters:**

- `read` (optional): Filter by read status (true/false)
- `limit` (optional): Items per page (default: 20)
- `page` (optional): Page number

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "notif_1",
      "userId": "user_123",
      "type": "task_assigned",
      "message": "Jane assigned you to 'Design Homepage'",
      "read": false,
      "createdAt": "2025-11-27T15:00:00Z"
    },
    {
      "id": "notif_2",
      "userId": "user_123",
      "type": "task_due",
      "message": "Fix login bug is due in 1 day",
      "read": false,
      "createdAt": "2025-11-27T14:00:00Z"
    }
  ],
  "unreadCount": 2
}
```

---

### `PATCH /notifications/:id/read`

Mark notification as read.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "notif_1",
    "read": true,
    "updatedAt": "2025-11-27T17:00:00Z"
  }
}
```

---

### `DELETE /notifications/:id`

Delete notification.

**Response (200):**

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

### `DELETE /notifications`

Clear all notifications.

**Response (200):**

```json
{
  "success": true,
  "message": "All notifications cleared"
}
```

---

## HTTP Status Codes

| Code  | Meaning                                          |
| ----- | ------------------------------------------------ |
| `200` | OK - Request successful                          |
| `201` | Created - Resource created successfully          |
| `204` | No Content - Successful, no response body        |
| `400` | Bad Request - Invalid input data                 |
| `401` | Unauthorized - Missing or invalid authentication |
| `403` | Forbidden - Insufficient permissions             |
| `404` | Not Found - Resource doesn't exist               |
| `409` | Conflict - Resource already exists               |
| `422` | Unprocessable Entity - Validation failed         |
| `500` | Server Error - Internal server error             |

---

## Rate Limiting

Currently not implemented, but recommended for production:

- 100 requests per 15 minutes per user
- 1000 requests per hour per IP

---

## Pagination

All list endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Sorting

Supported on most list endpoints:

- `sortBy`: Field name to sort by
- `sortOrder`: `asc` or `desc`

Example: `GET /tasks?sortBy=dueDate&sortOrder=asc`

---
