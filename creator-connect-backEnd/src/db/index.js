import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * connectDB — establishes a connection to MongoDB.
 * Called once at server startup from src/index.js.
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n✅ MongoDB connected successfully!
   Host: ${connectionInstance.connection.host}
   DB:   ${connectionInstance.connection.name}\n`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Exit with failure code so the process manager (PM2 / Docker) can restart
    process.exit(1);
  }
};

export default connectDB;
