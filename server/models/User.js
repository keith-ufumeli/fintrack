import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // GitHub OAuth fields
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now,
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

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
userSchema.index({ githubId: 1 });
userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);
