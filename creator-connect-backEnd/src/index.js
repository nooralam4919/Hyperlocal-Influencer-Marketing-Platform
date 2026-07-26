import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 2000;

/**
 * Bootstrap sequence:
 *  1. Connect to MongoDB
 *  2. Start the Express server
 */
connectDB()
  .then(() => {
    // Handle Express-level errors (e.g. port already in use)
    app.on("error", (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });

    app.listen(PORT, () => {
      console.log(`🚀 CreatorConnect API running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });
