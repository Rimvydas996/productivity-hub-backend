import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
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
