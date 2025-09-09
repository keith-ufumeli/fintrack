import express from "express";

const router = express.Router();

// Test endpoint to verify server is working
router.get("/test", (req, res) => {
  res.json({ message: "Backend server is working!", timestamp: new Date().toISOString() });
});

// Test endpoint to verify authentication
router.get("/test-auth", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  
  res.json({ 
    message: "Auth test endpoint", 
    hasToken: !!token,
    token: token ? token.substring(0, 20) + "..." : null,
    timestamp: new Date().toISOString() 
  });
});

// Migration endpoint to associate existing data with current user
router.post("/migrate-data", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    // Verify token and get user ID
    const jwt = await import("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const userId = decoded.userId;
    
    // Import models
    const Transaction = (await import("../models/Transaction.js")).default;
    const Loan = (await import("../models/Loan.js")).default;
    
    // Find all transactions and loans without user field
    const transactionsWithoutUser = await Transaction.find({ user: { $exists: false } });
    const loansWithoutUser = await Loan.find({ user: { $exists: false } });
    
    // Update them to belong to current user
    if (transactionsWithoutUser.length > 0) {
      await Transaction.updateMany(
        { user: { $exists: false } },
        { $set: { user: userId } }
      );
    }
    
    if (loansWithoutUser.length > 0) {
      await Loan.updateMany(
        { user: { $exists: false } },
        { $set: { user: userId } }
      );
    }
    
    res.json({
      message: "Data migration completed",
      transactionsUpdated: transactionsWithoutUser.length,
      loansUpdated: loansWithoutUser.length,
      userId: userId
    });
    
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ message: "Migration failed", error: error.message });
  }
});

export default router;
