import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MongoUrl = process.env.MONGO_URL;

export const dbconnect = async () => {
  try {
    await mongoose.connect(MongoUrl, {});
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};
