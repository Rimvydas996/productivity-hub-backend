# 🏗️ Architecture Documentation

## System Overview

Productivity Hub is a **full-stack collaborative task management system** designed with a modern, scalable architecture.

---

## 1. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React)                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │   Dashboard      │  │   Task Board     │  │   Quick Notes    │
│  │   Task Management│  │   (Kanban)       │  │   Calendar View  │
│  │   Workspace View │  │   Drag & Drop    │  │   Settings       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘
│                              ↓
│  REST API                Socket.IO Connection
│  (HTTP Request/Response)     (WebSocket)
│                              ↓
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       SERVER LAYER (Express)                     │
│  ┌─────────────────────────────────────────────────────────────┐
│  │              API Routes & Controllers                       │
│  │  /auth  /users  /tasks  /workspaces  /notes  /activities   │
│  └─────────────────────────────────────────────────────────────┘
│                              ↓
│  ┌─────────────────────────────────────────────────────────────┐
│  │              Business Logic Services                        │
│  │   Task Service  │ User Service │ Workspace Service         │
│  │   Note Service  │ Activity Service                          │
│  └─────────────────────────────────────────────────────────────┘
│                              ↓
│  ┌─────────────────────────────────────────────────────────────┐
│  │       Middleware & Authentication                           │
│  │   JWT Validation │ CORS │ Error Handling │ Validation       │
│  └─────────────────────────────────────────────────────────────┘
│                              ↓
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER (MongoDB)                          │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│  │ Users         │ │ Tasks         │ │ Workspaces    │         │
│  ├───────────────┤ ├───────────────┤ ├───────────────┤         │
│  │ email         │ │ workspaceId   │ │ name          │         │
│  │ password      │ │ createdBy     │ │ members       │         │
│  │ workspaces    │ │ assignedTo    │ │ admins        │         │
│  │ settings      │ │ status        │ │ createdAt     │         │
│  └───────────────┘ │ priority      │ └───────────────┘         │
│                    │ dueDate       │ ┌───────────────┐         │
│                    │ comments      │ │ Notes         │         │
│  ┌───────────────┐ │ attachments   │ ├───────────────┤         │
│  │ Activity Log  │ └───────────────┘ │ userId        │         │
│  ├───────────────┤ ┌───────────────┐ │ workspaceId   │         │
│  │ workspaceId   │ │ Notifications │ │ title         │         │
│  │ userId        │ ├───────────────┤ │ content       │         │
│  │ action        │ │ userId        │ └───────────────┘         │
│  │ targetId      │ │ type          │                           │
│  │ createdAt     │ │ message       │ ┌───────────────┐         │
│  └───────────────┘ │ read          │ │ File Attach   │         │
│                    │ createdAt     │ ├───────────────┤         │
│                    └───────────────┘ │ taskId        │         │
│                                       │ userId        │         │
│                                       │ url, size     │         │
│                                       └───────────────┘         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              BACKGROUND SERVICES                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  │ Cron Jobs        │ │ Socket.IO        │ │ File Upload      │
│  │ - Overdue Check  │ │ - Real-time      │ │ - S3/Cloudinary  │
│  │ - Repeat Tasks   │ │ - Notifications  │ │ - File Storage   │
│  │ - Cleanup        │ │ - Live Updates   │ │ - File Deletion  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Flow Examples

### A. Task Creation Flow

```
1. User clicks "Create Task" in React
   ↓
2. React sends POST /api/tasks with { title, workspaceId, description }
   ↓
3. Express auth middleware validates JWT
   ↓
4. TaskController.create() receives request
   ↓
5. TaskService.createTask() validates business logic
   ↓
6. Mongoose saves to MongoDB
   ↓
7. TaskService logs activity to ActivityLog collection
   ↓
8. Socket.IO broadcasts "task:created" to workspace members
   ↓
9. Response sent back to React with new task data
   ↓
10. React updates UI, all connected users see task in real-time
```

### B. Task Status Update (Drag & Drop)

```
1. User drags task from "To-Do" to "In Progress"
   ↓
2. React sends PATCH /api/tasks/:id with { status: "in-progress" }
   ↓
3. TaskController.update() receives request
   ↓
4. TaskService.updateTask() checks permissions
   ↓
5. Mongoose updates database
   ↓
6. Cron job checks if task was overdue (status changes "late" → "in-progress")
   ↓
7. ActivityLog records the change
   ↓
8. Socket.IO emits "task:updated" to all workspace members
   ↓
9. All clients receive update via WebSocket (instant, no page refresh)
   ↓
10. React updates local state, UI reflects immediately
```

### C. Real-Time Notification Flow

```
1. Task assigned to User B by User A
   ↓
2. TaskService creates Notification document
   ↓
3. Socket.IO checks if User B is connected
   ↓
4. If connected: emit "notification:new" via WebSocket
   ↓
5. If offline: Notification stays in DB, fetched on next login
   ↓
6. React receives notification
   ↓
7. Display in notification dropdown/bell icon
   ↓
8. User can mark as read → API call → Database update
```

---

## 3. Request-Response Cycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                               │
│                                                                       │
│  const response = await fetch('/api/tasks', {                        │
│    method: 'POST',                                                   │
│    headers: {                                                        │
│      'Authorization': 'Bearer <JWT_TOKEN>',                          │
│      'Content-Type': 'application/json'                              │
│    },                                                                │
│    body: JSON.stringify({ title, workspaceId })                      │
│  })                                                                  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        NETWORK (HTTP)                                 │
│                   POST /api/tasks                                     │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      SERVER (Express)                                 │
│                                                                       │
│  1. Router matches POST /api/tasks → TaskController.create()         │
│  2. CORS middleware allows request                                   │
│  3. Auth middleware validates JWT                                    │
│  4. Body parser parses JSON                                          │
│  5. Validation middleware checks required fields                     │
│  6. TaskController calls TaskService.createTask()                    │
│  7. TaskService validates business rules                             │
│  8. Mongoose model saves to MongoDB                                  │
│  9. ActivityService logs the action                                  │
│  10. Socket.IO broadcasts to workspace members                       │
│  11. Response sent: { success: true, data: { task } }               │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        NETWORK (HTTP)                                 │
│                    200 OK + JSON Response                             │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                               │
│                                                                       │
│  // Update React state                                               │
│  setTasks([...tasks, response.data])                                 │
│                                                                       │
│  // UI re-renders with new task                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Authentication Architecture

### JWT Token Structure

```
Header.Payload.Signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id_12345",
  "email": "user@example.com",
  "role": "user",
  "iat": 1700000000,           // issued at
  "exp": 1700604800            // expires at (7 days)
}

Signature: HMAC-SHA256(
  base64(header) + "." + base64(payload),
  secret_key
)
```

### Authentication Flow

```
1. User Signup
   POST /api/auth/signup
   → Validate email format
   → Hash password with bcryptjs
   → Create user in DB
   → Generate JWT
   → Return token to client

2. User Login
   POST /api/auth/login
   → Validate credentials
   → Compare password hash
   → Generate JWT
   → Return token to client

3. Protected Request
   GET /api/tasks
   Header: Authorization: Bearer <JWT>
   → Middleware verifies token signature
   → Extract userId from payload
   → Check token expiration
   → Allow request if valid

4. Token Refresh
   POST /api/auth/refresh
   → Verify old token (even if expired)
   → Generate new token
   → Return fresh token
```

---

## 5. WebSocket (Socket.IO) Architecture

### Connection Lifecycle

```
1. Client connects
   socket = io("https://server.com")

2. Server receives connection
   io.on("connection", (socket) => {
     console.log("User connected:", socket.id)
   })

3. Client joins workspace
   socket.emit("workspace:join", { workspaceId: "ws_123" })

4. Server adds client to room
   socket.join(`workspace_ws_123`)

5. Events broadcast to room
   io.to(`workspace_ws_123`).emit("task:updated", taskData)

6. All clients in room receive update
   socket.on("task:updated", (task) => {
     // Update UI
   })

7. User disconnects
   socket.disconnect()

8. Server removes from room
   io.on("disconnect", () => {
     console.log("User disconnected")
   })
```

### Real-Time Event Examples

```typescript
// Task Updates
socket.emit("task:update", { taskId, status, position });
socket.on("task:updated", (updatedTask) => {});

// Drag & Drop
socket.emit("task:dragStart", { taskId });
socket.on("task:dragEnd", (data) => {});

// Notifications
socket.on("notification:new", (notification) => {});

// Presence
socket.on("user:joined", { userId });
socket.on("user:left", { userId });

// Comments
socket.emit("comment:add", { taskId, text });
socket.on("comment:added", (comment) => {});
```

---

## 6. Service Layer Architecture

### Service Separation

```
Controller Layer (API endpoints)
        ↓
Service Layer (Business logic)
        ↓
Model Layer (Database)

Example: Create Task

1. Route Handler
   POST /api/tasks → TaskController.create()

2. Controller
   Receives request
   Calls TaskService.createTask(data)
   Returns response

3. Service
   Validates permissions
   Validates data
   Calls Task.create() (Mongoose)
   Triggers ActivityService.log()
   Emits Socket.IO event
   Returns created task

4. Model
   Validates schema
   Saves to MongoDB
   Returns saved document
```

---

## 7. Error Handling Flow

```
Request comes in
    ↓
Route → Controller → Service → Model
    ↓
Error occurs at any level
    ↓
Throw custom error:
  throw new AppError("Task not found", 404)
    ↓
Global Error Middleware catches
    ↓
Error middleware:
  - Logs error
  - Formats response
  - Sends standardized JSON
    ↓
Response:
{
  "success": false,
  "message": "Task not found",
  "statusCode": 404,
  "timestamp": "2025-11-27T10:00:00Z"
}
    ↓
Client receives error
    ↓
React shows error message to user
```

---

## 8. Database Indexing Strategy

### Recommended Indexes for Performance

```typescript
// Users
db.users.createIndex({ email: 1 }, { unique: true });

// Tasks
db.tasks.createIndex({ workspaceId: 1 });
db.tasks.createIndex({ assignedTo: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ dueDate: 1 });
db.tasks.createIndex({ workspaceId: 1, status: 1 });

// TTL Index for automatic cleanup of done tasks after 30 days
db.tasks.createIndex(
  { completedAt: 1 },
  { expireAfterSeconds: 2592000 } // 30 days
);

// Workspaces
db.workspaces.createIndex({ members: 1 });

// Activity Log
db.activities.createIndex({ workspaceId: 1 });
db.activities.createIndex({ createdAt: 1 });

// Notes
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ workspaceId: 1 });
```

---

## 9. Scalability Considerations

### Horizontal Scaling

```
Load Balancer (Nginx)
        ↓
    ┌───┴───┐
    ↓       ↓
Server-1  Server-2  Server-3
    ↓       ↓       ↓
    └───┬───┘
        ↓
    MongoDB (replicas)
```

### Session Management for Horizontal Scaling

- Use Redis for session store
- Socket.IO adapter for Redis (socket-io-redis)
- JWT tokens for stateless auth

---

## 10. Deployment Architecture

```
GitHub Repository
        ↓
Deploy trigger (push to main)
        ↓
Build Process
  - Clone repo
  - npm install
  - npm run build
  - Run tests
        ↓
Container/Server
  - Copy dist/ files
  - Start Express server
  - Connect to MongoDB
  - Initialize Socket.IO
        ↓
Reverse Proxy (Nginx)
  - SSL termination
  - Load balancing
  - Compression
        ↓
Client Browser
  - React app loaded
  - WebSocket connection established
```

---

This architecture ensures:

- ✅ **Scalability** - Horizontal scaling with load balancer
- ✅ **Real-time** - WebSocket for instant updates
- ✅ **Reliability** - Error handling and monitoring
- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Performance** - Proper indexing and caching
- ✅ **Security** - JWT auth and validation
