# 💾 Database Models & Setup Guide

Complete guide to MongoDB schema design and setup for Productivity Hub.

---

## MongoDB Setup

### Local Installation

```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify installation
mongosh
```

### Cloud Setup (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

---

## Database Models

### 1. User Model

**Collection:** `users`

**Purpose:** Store user account information and settings.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Authentication
  email: String (unique, required),
  passwordHash: String (required),

  // Profile
  name: String (required),
  avatar: String (URL, optional),

  // Relationships
  workspaces: [ObjectId],  // References to Workspace._id

  // Settings
  settings: {
    theme: String,        // "light" | "dark"
    notificationEnabled: Boolean,
    emailNotifications: Boolean,
    language: String      // "en" | "lt"
  },

  // Metadata
  lastLogin: Date,
  createdAt: Date (indexed),
  updatedAt: Date,
  isActive: Boolean
}
```

**Mongoose Schema Example:**

```typescript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],

  settings: {
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    notificationEnabled: {
      type: Boolean,
      default: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
```

**Indexes:**

```javascript
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
```

---

### 2. Workspace Model

**Collection:** `workspaces`

**Purpose:** Represent collaborative workspace where teams organize tasks.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Identity
  name: String (required),
  description: String (optional),

  // Members
  members: [ObjectId],      // References to User._id
  admins: [ObjectId],       // Subset of members with admin rights

  // Metadata
  createdBy: ObjectId,      // Reference to User._id
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

**Mongoose Schema Example:**

```typescript
const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: String,

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Workspace = mongoose.model("Workspace", workspaceSchema);
```

**Indexes:**

```javascript
db.workspaces.createIndex({ createdBy: 1 });
db.workspaces.createIndex({ members: 1 });
```

---

### 3. Task Model

**Collection:** `tasks`

**Purpose:** Core task object with comprehensive management features.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Relationships
  workspaceId: ObjectId (required),    // Reference to Workspace._id
  createdBy: ObjectId (required),      // Reference to User._id
  assignedTo: ObjectId,                // Reference to User._id (optional)

  // Task Content
  title: String (required),
  description: String,

  // Status & Priority
  status: String,          // "todo" | "in-progress" | "done" | "late"
  priority: String,        // "low" | "medium" | "high"
  tags: [String],

  // Dates
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date,

  // Recurrence
  repeat: {
    frequency: String,    // "none" | "daily" | "weekly" | "monthly"
    lastRepeatedDate: Date
  },

  // Related Data
  attachments: [ObjectId],  // References to FileAttachment._id
  comments: [{
    userId: ObjectId,       // Reference to User._id
    text: String,
    createdAt: Date
  }],

  // Metadata
  viewedBy: [ObjectId],     // Users who viewed this task
  likes: [ObjectId]         // Users who "liked" task (optional)
}
```

**Mongoose Schema Example:**

```typescript
const taskSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  title: {
    type: String,
    required: true,
  },

  description: String,

  status: {
    type: String,
    enum: ["todo", "in-progress", "done", "late"],
    default: "todo",
    index: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  tags: [String],

  dueDate: {
    type: Date,
    index: true,
  },

  repeat: {
    frequency: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    lastRepeatedDate: Date,
  },

  attachments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileAttachment",
    },
  ],

  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  completedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model("Task", taskSchema);
```

**Indexes:**

```javascript
// Performance indexes
db.tasks.createIndex({ workspaceId: 1 });
db.tasks.createIndex({ assignedTo: 1 });
db.tasks.createIndex({ status: 1 });
db.tasks.createIndex({ dueDate: 1 });
db.tasks.createIndex({ workspaceId: 1, status: 1 });

// TTL index: Auto-delete done tasks after 30 days
db.tasks.createIndex({ completedAt: 1 }, { expireAfterSeconds: 2592000, partialFilterExpression: { status: "done" } });
```

---

### 4. Note Model

**Collection:** `notes`

**Purpose:** Quick notes for personal or workspace use.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Ownership
  userId: ObjectId (required),        // Reference to User._id
  workspaceId: ObjectId,              // Reference to Workspace._id (optional)

  // Content
  title: String,
  content: String,

  // Metadata
  isPinned: Boolean (default: false),
  color: String,  // Hex color for visual organization

  createdAt: Date,
  updatedAt: Date
}
```

**Mongoose Schema Example:**

```typescript
const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
  },

  title: String,

  content: String,

  isPinned: {
    type: Boolean,
    default: false,
  },

  color: {
    type: String,
    default: "#FFFFFF",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Note = mongoose.model("Note", noteSchema);
```

**Indexes:**

```javascript
db.notes.createIndex({ userId: 1 });
db.notes.createIndex({ workspaceId: 1 });
db.notes.createIndex({ createdAt: -1 });
```

---

### 5. Activity Log Model

**Collection:** `activities`

**Purpose:** Audit trail of all user actions in workspace.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Context
  workspaceId: ObjectId (required),
  userId: ObjectId (required),        // Who performed action

  // Action Info
  action: String,  // "task_created", "task_updated", "member_added", etc.
  actionType: String,  // "create" | "update" | "delete" | "comment"

  // Target
  targetType: String,  // "task" | "note" | "workspace" | "user"
  targetId: ObjectId,
  targetName: String,

  // Changes
  changes: {
    oldValue: Any,
    newValue: Any,
    changedFields: [String]
  },

  // Metadata
  ipAddress: String (optional),
  userAgent: String (optional),
  createdAt: Date
}
```

**Mongoose Schema Example:**

```typescript
const activitySchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
    index: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  action: {
    type: String,
    required: true,
  },

  actionType: {
    type: String,
    enum: ["create", "update", "delete", "comment"],
    required: true,
  },

  targetType: {
    type: String,
    enum: ["task", "note", "workspace", "user"],
    required: true,
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  targetName: String,

  changes: {
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedFields: [String],
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Activity = mongoose.model("Activity", activitySchema);
```

**Indexes:**

```javascript
db.activities.createIndex({ workspaceId: 1, createdAt: -1 });
db.activities.createIndex({ userId: 1 });
```

---

### 6. Notification Model

**Collection:** `notifications`

**Purpose:** User notifications for real-time alerts.

**Schema:**

```typescript
{
  _id: ObjectId,

  // Recipient
  userId: ObjectId (required),        // Reference to User._id

  // Content
  type: String,  // "task_assigned", "task_due", "task_overdue", "comment_added"
  message: String,
  relatedTaskId: ObjectId,  // If notification is about task
  relatedUserId: ObjectId,  // If notification is about user

  // Status
  read: Boolean (default: false),

  // Metadata
  createdAt: Date
}
```

**Mongoose Schema Example:**

```typescript
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  type: {
    type: String,
    enum: ["task_assigned", "task_due", "task_overdue", "comment_added", "member_added"],
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  relatedTaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  read: {
    type: Boolean,
    default: false,
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
```

**Indexes:**

```javascript
db.notifications.createIndex({ userId: 1, read: 1 });
db.notifications.createIndex({ createdAt: -1 });
```

---

### 7. File Attachment Model

**Collection:** `attachments`

**Purpose:** References to attached files (files stored in S3/Cloudinary).

**Schema:**

```typescript
{
  _id: ObjectId,

  // Ownership
  userId: ObjectId (required),        // Reference to User._id
  taskId: ObjectId,                   // Reference to Task._id (optional)

  // File Info
  filename: String (required),
  originalName: String,
  url: String (S3/Cloudinary URL),

  // File Metadata
  size: Number,                       // Bytes
  mimeType: String,                   // e.g., "application/pdf"
  fileExtension: String,

  // Storage
  storageProvider: String,            // "s3" | "cloudinary"
  storageKey: String,                 // Key in S3 bucket

  createdAt: Date
}
```

**Mongoose Schema Example:**

```typescript
const attachmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  filename: {
    type: String,
    required: true,
  },

  originalName: String,

  url: {
    type: String,
    required: true,
  },

  size: {
    type: Number,
    required: true,
  },

  mimeType: String,

  storageProvider: {
    type: String,
    enum: ["s3", "cloudinary"],
    required: true,
  },

  storageKey: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FileAttachment = mongoose.model("FileAttachment", attachmentSchema);
```

---

## Database Relationships Diagram

```
User (1)
  ├── many Workspaces (has many)
  ├── many Tasks (created by)
  ├── many Tasks (assigned to)
  ├── many Notes
  ├── many Activities (performed)
  ├── many Notifications (received)
  └── many FileAttachments (uploaded)

Workspace (1)
  ├── many Users (members)
  ├── many Users (admins - subset of members)
  └── many Tasks

Task (1)
  ├── 1 Workspace (belongs to)
  ├── 1 User (created by)
  ├── 0-1 User (assigned to)
  ├── many FileAttachments
  └── many Comments (each with userId reference)

Note (1)
  ├── 1 User (owner)
  └── 0-1 Workspace

Activity (1)
  ├── 1 Workspace
  ├── 1 User (who performed)
  └── 1 Target (Task, Note, User, or Workspace)

Notification (1)
  ├── 1 User (recipient)
  ├── 0-1 Task (if about task)
  └── 0-1 User (if about user)

FileAttachment (1)
  ├── 1 User (uploader)
  └── 0-1 Task
```

---

## Connection String Examples

### Local MongoDB

```
mongodb://localhost:27017/productivity-hub
```

### MongoDB Atlas (Cloud)

```
mongodb+srv://username:password@cluster0.mongodb.net/productivity-hub?retryWrites=true&w=majority
```

### Mongoose Connection

```typescript
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-hub";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
```

---

## Seed Data for Development

```javascript
// Example seed script for development data

const users = [
  {
    email: "john@example.com",
    passwordHash: "hashed_password_123",
    name: "John Doe",
  },
  {
    email: "jane@example.com",
    passwordHash: "hashed_password_456",
    name: "Jane Smith",
  },
];

const workspaces = [
  {
    name: "Project Alpha",
    description: "Main project workspace",
    members: ["user_id_1", "user_id_2"],
    admins: ["user_id_1"],
    createdBy: "user_id_1",
  },
];

const tasks = [
  {
    workspaceId: "workspace_id_1",
    title: "Design Homepage",
    description: "Create homepage mockups",
    status: "in-progress",
    priority: "high",
    createdBy: "user_id_1",
    assignedTo: "user_id_2",
    dueDate: new Date("2025-12-05"),
  },
];
```

---

## Backup & Restore

### Backup MongoDB Atlas

```bash
# Using mongoexport
mongoexport --uri="mongodb+srv://user:password@cluster.mongodb.net/productivity-hub" \
  --collection=tasks \
  --out=tasks-backup.json
```

### Restore MongoDB Atlas

```bash
# Using mongoimport
mongoimport --uri="mongodb+srv://user:password@cluster.mongodb.net/productivity-hub" \
  --collection=tasks \
  --file=tasks-backup.json
```

---

## Data Retention Policy

- **Done Tasks:** Retained for 30 days, then automatically deleted by TTL index
- **Activity Logs:** Retained for 90 days (recommended)
- **Notifications:** Retained for 30 days
- **User Data:** Retained indefinitely until user deletion

---

## Performance Tips

1. **Use Proper Indexes** - Significantly speed up queries
2. **Pagination** - Always paginate large result sets
3. **Select Specific Fields** - Use projection to reduce data transfer
4. **Connection Pooling** - Mongoose handles this by default
5. **Avoid N+1 Queries** - Use `.populate()` efficiently
6. **Archive Old Data** - Periodically move old data to archive

---
