import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load correct env file
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || "development"}`)
});

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
