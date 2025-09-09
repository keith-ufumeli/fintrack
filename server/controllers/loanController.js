import Loan from "../models/Loan.js";

export const getLoans = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    console.log('Getting loans for user:', userId);
    
    // First, let's see what loans exist
    const allLoans = await Loan.find();
    console.log('All loans in DB:', allLoans.length);
    
    // Try to find loans for this user
    const userLoans = await Loan.find({ user: userId }).sort({ date: -1 });
    console.log('User loans found:', userLoans.length);
    
    res.json(userLoans);
  } catch (err) {
    console.error('Error in getLoans:', err);
    res.status(500).json({ message: err.message });
  }
};

export const addLoan = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const loanData = {
      ...req.body,
      user: userId,
    };
    const loan = new Loan(loanData);
    const saved = await loan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateLoan = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    
    const loan = await Loan.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    res.json(loan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteLoan = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { id } = req.params;
    
    const loan = await Loan.findOneAndDelete({ _id: id, user: userId });
    
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    
    res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
