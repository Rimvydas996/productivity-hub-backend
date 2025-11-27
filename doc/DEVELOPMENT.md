# 🚀 Development Guide

Complete guide to setting up the development environment and contributing to the project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Setup](#project-setup)
4. [Development Workflow](#development-workflow)
5. [Code Structure](#code-structure)
6. [Best Practices](#best-practices)
7. [Testing](#testing)
8. [Debugging](#debugging)
9. [Deployment](#deployment)

---

## Prerequisites

### Required Software

- **Node.js** 16+ (Get from [nodejs.org](https://nodejs.org))
- **npm** 7+ (comes with Node.js)
- **MongoDB** 5+ (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** (for version control)
- **VS Code** (recommended IDE)

### Verify Installation

```bash
node --version     # v18.x.x or higher
npm --version      # 8.x.x or higher
mongodb --version  # 5.x or higher (if installed locally)
git --version      # 2.x.x or higher
```

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-org/productivity-hub-backend.git
cd productivity-hub-backend
```

### 2. Install Dependencies

```bash
npm install
```

This installs:

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - Real-time communication
- **typescript** - Type safety
- **ts-node-dev** - Development server
- And all other dependencies from `package.json`

### 3. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/productivity-hub
# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/productivity-hub

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Socket.IO
SOCKET_URL=http://localhost:3000

# Optional: File Storage
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=your_bucket_name

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Start MongoDB (if local)

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verify connection
mongosh
```

### 5. Start Development Server

```bash
npm run dev
```

You should see:

```
[ts-node-dev] server is running on port 5000
Connected to MongoDB
Server started: http://localhost:5000
```

---

## Project Setup

### Folder Structure

```
/src
  ├─ /config         # Configuration files
  ├─ /models         # Mongoose schemas
  ├─ /controllers    # API controllers
  ├─ /services       # Business logic
  ├─ /routes         # API routes
  ├─ /middlewares    # Express middlewares
  ├─ /sockets        # Socket.IO handlers
  ├─ /jobs           # Cron jobs
  ├─ /utils          # Utilities
  ├─ /types          # TypeScript interfaces
  ├─ app.ts          # Express app initialization
  └─ server.ts       # Server entry point

/dist                # Compiled JavaScript (after npm run build)
package.json         # Dependencies and scripts
tsconfig.json        # TypeScript configuration
.env                 # Environment variables
.gitignore           # Git ignore file
```

---

## Development Workflow

### Daily Development Process

#### 1. Start Development Server

```bash
npm run dev
```

The server:

- Automatically restarts when files change
- Shows TypeScript errors in terminal
- Logs API requests
- Maintains WebSocket connections

#### 2. Make Changes

Edit files in `/src` directory. TypeScript compilation happens automatically.

#### 3. Test Changes

- Use **Postman** or **REST Client** to test API
- Check browser console for Socket.IO events
- Monitor server logs for errors

#### 4. Commit Changes

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

### Git Workflow

#### Create Feature Branch

```bash
git checkout -b feature/new-feature
```

#### Work on Feature

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
```

#### Push to Remote

```bash
git push origin feature/new-feature
```

#### Create Pull Request

Go to GitHub and create PR for code review.

#### Merge to Main

After review and tests pass:

```bash
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
```

---

## Code Structure

### Adding a New Endpoint

#### 1. Create Model (if needed)

`/src/models/Comment.model.ts`:

```typescript
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
```

#### 2. Create Service (business logic)

`/src/services/comment.service.ts`:

```typescript
import { Comment } from "../models/Comment.model";

export class CommentService {
  static async createComment(taskId: string, userId: string, text: string) {
    const comment = await Comment.create({
      taskId,
      userId,
      text,
    });
    return comment.populate("userId");
  }

  static async getComments(taskId: string) {
    return Comment.find({ taskId }).populate("userId");
  }

  static async deleteComment(commentId: string, userId: string) {
    const comment = await Comment.findById(commentId);
    if (comment?.userId.toString() !== userId) {
      throw new Error("Unauthorized");
    }
    return Comment.findByIdAndDelete(commentId);
  }
}
```

#### 3. Create Controller (API handler)

`/src/controllers/comment.controller.ts`:

```typescript
import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

export class CommentController {
  static async createComment(req: Request, res: Response) {
    try {
      const { taskId, text } = req.body;
      const userId = req.user?.id;

      const comment = await CommentService.createComment(taskId, userId, text);

      res.status(201).json({
        success: true,
        data: comment,
        message: "Comment created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  static async getComments(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const comments = await CommentService.getComments(taskId);

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

#### 4. Create Routes

`/src/routes/comment.routes.ts`:

```typescript
import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/tasks/:taskId/comments", authMiddleware, CommentController.createComment);

router.get("/tasks/:taskId/comments", authMiddleware, CommentController.getComments);

export default router;
```

#### 5. Register Routes in App

`/src/app.ts`:

```typescript
import commentRoutes from "./routes/comment.routes";

app.use("/api", commentRoutes);
```

---

## Best Practices

### 1. Code Organization

```typescript
// ✅ Good: Clear separation of concerns
async function createTask(workspaceId, title, assignedTo) {
  // Validate input
  validateTaskInput(title);

  // Check permissions
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  // Create task
  const task = await Task.create({ workspaceId, title, assignedTo });

  // Log activity
  await ActivityService.logActivity(workspaceId, "task_created", task._id);

  // Emit event
  io.to(workspaceId).emit("task:created", task);

  return task;
}

// ❌ Bad: Mixed concerns
async function createTask(req, res) {
  // Everything in one place
  const task = new Task(req.body);
  task.save();
  res.json(task);
}
```

### 2. Error Handling

```typescript
// ✅ Good: Specific error handling
try {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }
  // ... rest of logic
} catch (error) {
  if (error.message === "TASK_NOT_FOUND") {
    res.status(404).json({ message: "Task not found" });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
}

// ❌ Bad: Generic error handling
try {
  // ...
} catch (error) {
  res.status(500).json({ message: "Error" });
}
```

### 3. Async/Await

```typescript
// ✅ Good: Clear async operations
async function getTasks(workspaceId) {
  const tasks = await Task.find({ workspaceId });
  const enriched = await Promise.all(
    tasks.map(async (task) => ({
      ...task.toObject(),
      assignee: await User.findById(task.assignedTo),
    }))
  );
  return enriched;
}

// ❌ Bad: Nested callbacks
function getTasks(workspaceId, callback) {
  Task.find({ workspaceId }, (err, tasks) => {
    tasks.forEach((task) => {
      User.findById(task.assignedTo, (err, user) => {
        callback(tasks, user);
      });
    });
  });
}
```

### 4. Validation

```typescript
// ✅ Good: Input validation
function validateTaskInput(title, dueDate) {
  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }
  if (title.length > 100) {
    throw new Error("Title must be less than 100 characters");
  }
  if (dueDate && isNaN(Date.parse(dueDate))) {
    throw new Error("Invalid due date format");
  }
}

// ❌ Bad: No validation
function createTask(title) {
  // Assuming title is valid
  return Task.create({ title });
}
```

### 5. Logging

```typescript
// ✅ Good: Structured logging
const logger = {
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data),
};

logger.info("Task created", { taskId, workspaceId });

// ❌ Bad: Inconsistent logging
console.log("Task created");
console.error("Error:", err);
```

---

## Testing

### Manual Testing with Postman

1. **Download Postman** from [postman.com](https://www.postman.com)

2. **Import Collection** (or create requests manually)

3. **Test Authentication**

   - POST `http://localhost:5000/api/auth/signup`
   - Body: `{ "email": "test@example.com", "password": "123456", "name": "Test" }`

4. **Use Token**

   - Copy token from response
   - In Headers: `Authorization: Bearer <token>`

5. **Test Endpoints**
   - GET `http://localhost:5000/api/workspaces`
   - POST `http://localhost:5000/api/tasks`
   - etc.

### Unit Testing (Future)

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create test file `/src/__tests__/task.service.test.ts`:

```typescript
import { TaskService } from "../services/task.service";

describe("TaskService", () => {
  it("should create a task", async () => {
    const task = await TaskService.createTask({
      title: "Test Task",
      workspaceId: "ws_123",
    });
    expect(task.title).toBe("Test Task");
  });
});
```

---

## Debugging

### 1. VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/src/server.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "preLaunchTask": "tsc: build"
    }
  ]
}
```

### 2. Console Logging

```typescript
console.log("Variable value:", variable);
console.log("Full object:", JSON.stringify(object, null, 2));
console.log("Error stack:", error.stack);
```

### 3. MongoDB Debugging

```bash
# Check database
mongosh

# List databases
show dbs

# Use specific database
use productivity-hub

# List collections
show collections

# Query data
db.tasks.find({}).pretty()

# Count documents
db.tasks.countDocuments()
```

### 4. Socket.IO Debugging

```typescript
// Add to socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  console.log("All connected clients:", io.engine.clientsCount);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
```

---

## Deployment

### Build for Production

```bash
npm run build
```

This creates `/dist` folder with compiled JavaScript.

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/productivity-hub
JWT_SECRET=very-long-secret-key-change-this
JWT_EXPIRE=7d
SOCKET_URL=https://api.productivityhub.com
```

### Deploy to Render.com

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Connect Render.com**

   - Go to [render.com](https://render.com)
   - Connect GitHub account
   - Create new Web Service
   - Select repository
   - Settings:
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Environment: Add variables from `.env`

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get production URL

### Deploy to Railway.app

1. **Connect Railway.app**

   - Go to [railway.app](https://railway.app)
   - Connect GitHub
   - Create new project from repo

2. **Configure**

   - Add variables in Railway dashboard
   - Railway auto-detects Node.js

3. **Deploy**
   - Auto-deploys on push to main
   - Get production URL

### Environment Variables Checklist

- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (production database)
- [ ] `JWT_SECRET` (strong random string)
- [ ] `SOCKET_URL` (production frontend URL)
- [ ] `AWS_*` (if using S3)
- [ ] `SMTP_*` (if using email)

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB or check connection string in `.env`

#### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

```bash
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### JWT Token Expired

```
Error: TokenExpiredError: jwt expired
```

**Solution:** User needs to login again or use refresh endpoint

#### TypeScript Compilation Error

```
Error: TS2304: Cannot find name 'interface'
```

**Solution:** Check imports, rebuild project with `npm run build`

#### Socket.IO Connection Failed

```
Error: WebSocket is closed before the connection is established
```

**Solution:** Check SOCKET_URL in `.env`, ensure frontend is connecting correctly

---

## Resources

- **Express Documentation:** https://expressjs.com
- **Mongoose Documentation:** https://mongoosejs.com
- **Socket.IO Documentation:** https://socket.io
- **MongoDB Documentation:** https://docs.mongodb.com
- **TypeScript Documentation:** https://www.typescriptlang.org
- **Node.js Documentation:** https://nodejs.org/docs

---

## Getting Help

1. Check existing GitHub issues
2. Create new issue with detailed description
3. Provide error messages and steps to reproduce
4. Share relevant code snippets

---

**Last Updated:** November 27, 2025
