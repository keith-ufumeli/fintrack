import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback-secret", {
    expiresIn: "7d",
  });
};

// Create or update user on sign in
export const signIn = async (req, res) => {
  try {
    const { githubId, username, email, name, avatar } = req.body;

    if (!githubId || !username || !email || !name) {
      return res.status(400).json({
        message: "Missing required fields: githubId, username, email, name",
      });
    }

    // Find existing user or create new one
    let user = await User.findOne({ githubId });

    if (user) {
      // Update existing user's last login and any changed info
      user.lastLogin = new Date();
      user.username = username;
      user.email = email;
      user.name = name;
      if (avatar) user.avatar = avatar;
      user.isActive = true;
      await user.save();
    } else {
      // Create new user
      user = new User({
        githubId,
        username,
        email,
        name,
        avatar,
        lastLogin: new Date(),
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Sign in successful",
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Sign out user (update last activity)
export const signOut = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Update last login time (could be used for session tracking)
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });

    res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const user = await User.findById(userId).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Deactivate user account
export const deactivateAccount = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Deactivate account error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
