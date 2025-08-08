import mongoose from "mongoose";

const connectDB = async () => {
  const mongoURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_TEST;

  try {
    await mongoose.connect(mongoURI);
    console.log(`✅ Connected to ${process.env.NODE_ENV} database`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
