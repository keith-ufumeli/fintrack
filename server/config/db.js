import mongoose from "mongoose";

const connectDB = async () => {
  console.log("🔍 Debug - Environment variables:");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("MONGO_URI_TEST:", process.env.MONGO_URI_TEST);
  console.log("MONGO_URI_PROD:", process.env.MONGO_URI_PROD);
  
  const mongoURI =
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_TEST;

  console.log("🔍 Selected MongoDB URI:", mongoURI);

  try {
    await mongoose.connect(mongoURI);
    console.log(`✅ Connected to ${process.env.NODE_ENV} database`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
