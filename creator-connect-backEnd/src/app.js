import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// ─── Route imports ─────────────────────────────────────────────────────────────
import userRouter     from "./routes/user.router.js";
import creatorRouter  from "./routes/creator.router.js";
import tweetRouter    from "./routes/tweet.router.js";
import commentRouter  from "./routes/comment.router.js";
import likeRouter     from "./routes/like.router.js";
import videoRouter    from "./routes/video.route.js";
import dashboardRouter from "./routes/dashboard.router.js";
import collabRouter   from "./routes/collab.router.js";
import messageRouter  from "./routes/message.router.js";

const app = express();

// ─── Global middleware ─────────────────────────────────────────────────────────

// CORS — allow the frontend origin to send cookies
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Parse JSON and URL-encoded bodies (limit 16 KB)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from /public
app.use(express.static("public"));

// Parse cookies (needed for httpOnly JWT cookies)
app.use(cookieParser());

// ─── API Routes ────────────────────────────────────────────────────────────────
// Prefix everything with /api/v1
app.use("/api/v1/users",     userRouter);
app.use("/api/v1/creators",  creatorRouter);
app.use("/api/v1/community", tweetRouter);
app.use("/api/v1/comments",  commentRouter);
app.use("/api/v1/likes",     likeRouter);
app.use("/api/v1/videos",    videoRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/collab",    collabRouter);
app.use("/api/v1/messages",  messageRouter);

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal Server Error";

  console.error(`[Error] ${statusCode} — ${message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };
