# 📊 Productivity Hub - Backend

A full-featured task management and collaboration platform backend built with **Express.js**, **MongoDB**, **TypeScript**, and **Socket.IO** for real-time updates.

---

## 🎯 Project Overview

**Productivity Hub** is a comprehensive workspace management system that allows users to:

### A. Account & User Management

- Create and manage user accounts
- Secure login/logout with JWT authentication
- Delete account functionality
- User profile management

### B. Workspace Management

- Create and manage multiple workspaces
- Add team members to workspaces
- Assign tasks to other users
- Role-based permissions

### C. Task Management

- Create, read, update, delete (CRUD) tasks
- Set task deadlines and due dates
- Assign tasks to team members
- Organize tasks in columns: **To-Do**, **In Progress**, **Done**
- Drag & drop tasks between columns (via Socket.IO)
- Mark tasks as complete
- Automatic "Late" status for overdue tasks
- Task priority levels (low, medium, high)
- Add tags/categories to tasks
- Attach files to tasks
- Add comments and discuss tasks with team

### D. Calendar & Scheduling

- Add tasks to calendar
- Set repeating tasks (daily, weekly, monthly)
- View task calendar integration

### E. Additional Features

- Quick Notes (personal notes per user or workspace)
- Activity Log (track all workspace changes)
- Completed tasks retention (30 days in database)
- Search and filter tasks
- Real-time notifications (via Socket.IO)
- Dark/Light mode settings
- Analytics and productivity insights
- Offline-ready architecture

---

## 🏗️ Project Architecture

```
Backend (Node.js + Express)
        ↓
MongoDB (Document Database)
        ↓
Socket.IO (Real-time Updates)
        ↓
Cron Jobs (Task Management)
```

### Communication Flow:

1. **React Frontend** sends REST API requests to Express server
2. **Express Server** authenticates, validates, and processes requests
3. **Mongoose** handles MongoDB data persistence
4. **Socket.IO** broadcasts real-time updates to all connected clients
5. **Cron Jobs** automatically manage overdue tasks, repetitions, and cleanups

---

## 📁 Project Structure

```
/server
│
├─ /src
│   ├─ /config
│   │    ├─ db.ts               # MongoDB connection setup
│   │    ├─ env.ts              # Environment variables config
│   │    └─ logger.ts           # Application logging
│   │
│   ├─ /models
│   │    ├─ User.model.ts       # User schema and methods
│   │    ├─ Task.model.ts       # Task schema and methods
│   │    ├─ Workspace.model.ts  # Workspace schema
│   │    ├─ Note.model.ts       # Quick Notes schema
│   │    ├─ ActivityLog.model.ts# Activity tracking schema
│   │    ├─ Notification.model.ts# Notifications schema
│   │    └─ FileAttachment.model.ts # File references
│   │
│   ├─ /controllers
│   │    ├─ auth.controller.ts      # Authentication endpoints
│   │    ├─ user.controller.ts      # User management endpoints
│   │    ├─ task.controller.ts      # Task CRUD endpoints
│   │    ├─ workspace.controller.ts # Workspace management endpoints
│   │    ├─ note.controller.ts      # Notes endpoints
│   │    ├─ activity.controller.ts  # Activity log endpoints
│   │    └─ notification.controller.ts # Notifications endpoints
│   │
│   ├─ /services
│   │    ├─ auth.service.ts         # Authentication business logic
│   │    ├─ user.service.ts         # User management logic
│   │    ├─ task.service.ts         # Task operations logic
│   │    ├─ workspace.service.ts    # Workspace operations logic
│   │    ├─ note.service.ts         # Notes operations logic
│   │    ├─ activity.service.ts     # Activity logging logic
│   │    ├─ notification.service.ts # Notification logic
│   │    └─ file.service.ts         # File upload/storage logic
│   │
│   ├─ /routes
│   │    ├─ auth.routes.ts          # /api/auth routes
│   │    ├─ user.routes.ts          # /api/users routes
│   │    ├─ task.routes.ts          # /api/tasks routes
│   │    ├─ workspace.routes.ts     # /api/workspaces routes
│   │    ├─ note.routes.ts          # /api/notes routes
│   │    ├─ activity.routes.ts      # /api/activities routes
│   │    └─ notification.routes.ts  # /api/notifications routes
│   │
│   ├─ /middlewares
│   │    ├─ auth.middleware.ts      # JWT verification
│   │    ├─ error.middleware.ts     # Global error handling
│   │    ├─ validation.middleware.ts# Request validation
│   │    └─ cors.middleware.ts      # CORS configuration
│   │
│   ├─ /sockets
│   │    ├─ index.ts                # Socket.IO initialization
│   │    ├─ task.socket.ts          # Task real-time events
│   │    ├─ notification.socket.ts  # Notification events
│   │    └─ workspace.socket.ts     # Workspace collaboration events
│   │
│   ├─ /jobs
│   │    ├─ overdueChecker.ts       # Cron: Check overdue tasks (every minute)
│   │    ├─ repeatTaskCreator.ts    # Cron: Create repeated tasks
│   │    └─ cleanupDoneTasks.ts     # Cron: Delete 30-day old done tasks
│   │
│   ├─ /utils
│   │    ├─ generateToken.ts        # JWT token generation
│   │    ├─ apiResponse.ts          # Standardized API responses
│   │    ├─ permissions.ts          # Authorization checks
│   │    ├─ dateHelpers.ts          # Date manipulation utilities
│   │    └─ validators.ts           # Input validation helpers
│   │
│   ├─ /types
│   │    ├─ user.types.ts           # TypeScript interfaces
│   │    ├─ task.types.ts
│   │    ├─ workspace.types.ts
│   │    └─ common.types.ts
│   │
│   ├─ app.ts                       # Express app initialization
│   └─ server.ts                    # Server entry point
│
├─ .env.example                     # Environment template
├─ package.json                     # Dependencies
├─ tsconfig.json                    # TypeScript configuration
├─ .gitignore
└─ README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)
- **TypeScript** 5+

### Installation

1. **Clone and navigate to project:**

   ```bash
   cd /path/to/productivity-hub-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env
   ```

   Configure `.env`:

   ```env
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productivity-hub

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Socket.IO
   SOCKET_URL=http://localhost:3000

   # File Storage (S3/Cloudinary)
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_S3_BUCKET=your_bucket
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:5000`

---

## 📚 Database Models

### User Model

Stores user account information and preferences.

```typescript
{
  email: String,
  passwordHash: String,
  name: String,
  workspaces: [ObjectId],        // References to Workspace
  settings: {
    theme: "light" | "dark",
    notificationEnabled: Boolean
  },
  createdAt: Date
}
```

### Workspace Model

Represents a collaborative workspace where teams work together.

```typescript
{
  name: String,
  members: [ObjectId],            // References to User
  admins: [ObjectId],             // References to User
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model

Core task object with comprehensive management features.

```typescript
{
  workspaceId: ObjectId,          // Reference to Workspace
  createdBy: ObjectId,            // Reference to User
  assignedTo: ObjectId,           // Reference to User

  title: String,
  description: String,
  status: "todo" | "in-progress" | "done" | "late",
  priority: "low" | "medium" | "high",
  tags: [String],

  dueDate: Date,
  completedAt: Date,

  repeat: {
    frequency: "daily" | "weekly" | "monthly" | "none"
  },

  attachments: [ObjectId],        // References to FileAttachment
  comments: [{
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],

  createdAt: Date,
  updatedAt: Date
}
```

### Note Model

User quick notes within workspace context.

```typescript
{
  userId: ObjectId,               // Reference to User
  workspaceId: ObjectId,          // Reference to Workspace

  title: String,
  content: String,

  createdAt: Date,
  updatedAt: Date
}
```

### Activity Log Model

Tracks all user actions for audit trail.

```typescript
{
  workspaceId: ObjectId,
  userId: ObjectId,

  action: String,                 // e.g., "task_created", "task_updated"
  targetType: "task" | "note" | "workspace" | "user",
  targetId: ObjectId,

  changes: {
    oldValue: Any,
    newValue: Any
  },

  createdAt: Date
}
```

### Notification Model

User notifications for real-time alerts.

```typescript
{
  userId: ObjectId,
  type: "task_assigned" | "task_due" | "task_overdue" | "comment_added",
  message: String,

  read: Boolean,

  createdAt: Date
}
```

### FileAttachment Model

References to attached files (actual files stored in S3/Cloudinary).

```typescript
{
  userId: ObjectId,
  taskId: ObjectId,

  filename: String,
  url: String,
  size: Number,
  mimeType: String,

  createdAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Endpoint   | Method | Description              |
| ---------- | ------ | ------------------------ |
| `/signup`  | POST   | Register new user        |
| `/login`   | POST   | User login (returns JWT) |
| `/logout`  | POST   | User logout              |
| `/refresh` | POST   | Refresh JWT token        |

### User Routes (`/api/users`)

| Endpoint | Method | Description              |
| -------- | ------ | ------------------------ |
| `/me`    | GET    | Get current user profile |
| `/:id`   | GET    | Get user by ID           |
| `/:id`   | PATCH  | Update user profile      |
| `/:id`   | DELETE | Delete user account      |

### Workspace Routes (`/api/workspaces`)

| Endpoint               | Method | Description                  |
| ---------------------- | ------ | ---------------------------- |
| `/`                    | GET    | Get all user workspaces      |
| `/`                    | POST   | Create new workspace         |
| `/:id`                 | GET    | Get workspace details        |
| `/:id`                 | PATCH  | Update workspace             |
| `/:id`                 | DELETE | Delete workspace             |
| `/:id/members`         | POST   | Add member to workspace      |
| `/:id/members/:userId` | DELETE | Remove member from workspace |

### Task Routes (`/api/tasks`)

| Endpoint                   | Method | Description                              |
| -------------------------- | ------ | ---------------------------------------- |
| `/`                        | GET    | Get tasks (filtered by workspace)        |
| `/`                        | POST   | Create new task                          |
| `/:id`                     | GET    | Get task details                         |
| `/:id`                     | PATCH  | Update task (status, assignee, priority) |
| `/:id`                     | DELETE | Delete task                              |
| `/:id/comments`            | POST   | Add comment to task                      |
| `/:id/comments/:commentId` | DELETE | Remove comment                           |

### Notes Routes (`/api/notes`)

| Endpoint | Method | Description      |
| -------- | ------ | ---------------- |
| `/`      | GET    | Get all notes    |
| `/`      | POST   | Create new note  |
| `/:id`   | GET    | Get note details |
| `/:id`   | PATCH  | Update note      |
| `/:id`   | DELETE | Delete note      |

### Activity Log Routes (`/api/activities`)

| Endpoint                  | Method | Description            |
| ------------------------- | ------ | ---------------------- |
| `/workspace/:workspaceId` | GET    | Get workspace activity |
| `/task/:taskId`           | GET    | Get task activity      |

### Notifications Routes (`/api/notifications`)

| Endpoint    | Method | Description               |
| ----------- | ------ | ------------------------- |
| `/`         | GET    | Get user notifications    |
| `/:id/read` | PATCH  | Mark notification as read |
| `/`         | DELETE | Clear all notifications   |

---

## 🔌 Socket.IO Events

Real-time communication for collaborative features.

### Task Events

```typescript
// Client → Server
socket.emit("task:update", { taskId, status, position });
socket.emit("task:create", { title, workspaceId });

// Server → Clients
socket.on("task:updated", (task) => {});
socket.on("task:created", (task) => {});
socket.on("task:deleted", (taskId) => {});
```

### Workspace Collaboration

```typescript
// Join workspace for real-time updates
socket.emit("workspace:join", { workspaceId });

// Leave workspace
socket.emit("workspace:leave", { workspaceId });

// Broadcast to all workspace members
socket.on("user:joined", { userId, workspaceId });
socket.on("user:left", { userId, workspaceId });
```

### Notifications

```typescript
// Receive real-time notifications
socket.on("notification:new", (notification) => {});
```

---

## ⏰ Cron Jobs

Automated background tasks:

### 1. Overdue Task Checker

- **Frequency:** Every minute
- **Action:** Check tasks with `dueDate < now()` and `status !== "done"`
- **Result:** Update status to "late", emit Socket.IO event

### 2. Repeat Task Creator

- **Frequency:** Daily at midnight
- **Action:** Find tasks with `repeat.frequency !== "none"` and `completedAt` is old
- **Result:** Create new instance of task for next period

### 3. Cleanup Old Done Tasks

- **Frequency:** Daily at 2 AM
- **Action:** Delete tasks where `status === "done"` and created > 30 days ago
- **Result:** Clean up database, reduce storage

---

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User logs in with email/password
2. Server validates credentials
3. Server generates JWT with `userId` and `role`
4. Client stores JWT in localStorage
5. Client includes JWT in `Authorization: Bearer <token>` header
6. Server verifies token in middleware
7. Request proceeds or returns 401 Unauthorized

### Permission Checks

- Only workspace members can access workspace tasks
- Only workspace admins can add/remove members
- Only task creator/assignee can update task
- Only users can delete their own account

---

## 🛠️ Development Scripts

```bash
# Development server with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# TypeScript compilation check
npx tsc --noEmit

# Run tests (when added)
npm test
```

---

## 📦 Dependencies

### Core

- **express** (5.1.0) - Web framework
- **mongoose** (9.0.0) - MongoDB ODM
- **socket.io** (4.8.1) - Real-time communication
- **typescript** (5.9.3) - Type safety

### Utilities

- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **node-cron** - Scheduled jobs
- **cors** - Cross-origin requests

### Development

- **ts-node-dev** - TypeScript development runner
- **nodemon** - Auto-restart on file changes
- **@types/node** - Node.js type definitions

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates optimized JavaScript in `/dist` folder.

### Environment Setup

Ensure `.env` is configured with production values:

- Production MongoDB URI (MongoDB Atlas recommended)
- Secure JWT secret
- Appropriate CORS origins
- Production file storage credentials

### Hosting Options

- **Render.com** (recommended for Node.js)
- **Railway.app** (simple deployment)
- **Heroku** (traditional)
- **AWS EC2/Elastic Beanstalk** (advanced)
- **DigitalOcean** (VPS option)

### Database

- **MongoDB Atlas** (cloud, recommended)
- **Self-hosted MongoDB** (more control)

---

## 📊 Future Enhancements

- [ ] Email notifications with nodemailer
- [ ] Integration with Google Calendar
- [ ] Slack webhook notifications
- [ ] File preview system
- [ ] Advanced analytics dashboard
- [ ] Two-factor authentication (2FA)
- [ ] Workspace templates
- [ ] Bulk task operations
- [ ] Task dependency chains
- [ ] Time tracking for tasks

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit pull request

---

## 📝 License

ISC License - See LICENSE file for details

---

## 📞 Support

For questions or issues, contact the development team or open an issue on the project repository.

---

**Last Updated:** November 27, 2025  
**Project Version:** 1.0.0  
**Status:** In Development
