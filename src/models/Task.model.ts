import mongoose from "mongoose";

//* Defines the Task data structure
const taskSchema = new mongoose.Schema({
  // workspaceId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Workspace",
  //   required: true,
  // },

  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },

  // assignedTo: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },

  title: {
    type: String,
    required: true,
  },

  // description: String,

  // status: {
  //   type: String,
  //   enum: ["todo", "in-progress", "done", "late"],
  //   default: "todo",
  //   index: true,
  // },

  // priority: {
  //   type: String,
  //   enum: ["low", "medium", "high"],
  //   default: "medium",
  // },

  // tags: [String],
  // /**
  //  * Todo: add enums
  //  */

  // dueDate: {
  //   type: Date,
  //   index: true,
  // },

  // repeat: {
  //   frequency: {
  //     type: String,
  //     enum: ["none", "daily", "weekly", "monthly"],
  //     default: "none",
  //   },
  //   lastRepeatedDate: Date,
  // },

  // attachments: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "FileAttachment",
  //   },
  // ],

  // comments: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //     },
  //     text: String,
  //     createdAt: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],

  // completedAt: Date,

  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },

  // updatedAt: {
  //   type: Date,
  //   default: Date.now,
  // },
});

export const Task = mongoose.model("Task", taskSchema);
