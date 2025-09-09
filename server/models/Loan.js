import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  person: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["lend", "borrow"], // lend = I gave money, borrow = I received money
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
});

// Index for faster queries by user
loanSchema.index({ user: 1, date: -1 });

export default mongoose.model("Loan", loanSchema);
