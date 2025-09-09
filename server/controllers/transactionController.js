import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    console.log('Getting transactions for user:', userId);
    
    // First, let's see what transactions exist
    const allTransactions = await Transaction.find();
    console.log('All transactions in DB:', allTransactions.length);
    
    // Try to find transactions for this user
    const userTransactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    console.log('User transactions found:', userTransactions.length);
    
    // If no user-specific transactions found, but user exists, return empty array
    // This is expected for new users
    res.json(userTransactions);
  } catch (err) {
    console.error('Error in getTransactions:', err);
    res.status(500).json({ message: err.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const transactionData = {
      ...req.body,
      user: userId,
    };
    const transaction = new Transaction(transactionData);
    const saved = await transaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    
    const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
