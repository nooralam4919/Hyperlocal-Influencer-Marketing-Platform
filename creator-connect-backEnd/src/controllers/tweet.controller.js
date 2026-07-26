import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Create a community post ──────────────────────────────────────────────────
const createTweet = asyncHandler(async (req, res) => {
  const { content, topic } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Post content is required");
  }

  const tweet = await Tweet.create({
    author: req.user._id,
    content: content.trim(),
    topic: topic || "General",
  });

  const populated = await tweet.populate("author", "name avatar role");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Post created successfully"));
});

// ─── Get all community posts (public feed) ────────────────────────────────────
const getAllTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, topic } = req.query;

  const filter = {};
  if (topic && topic !== "All") filter.topic = topic;

  const [tweets, total] = await Promise.all([
    Tweet.find(filter)
      .populate("author", "name avatar role")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    Tweet.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { tweets, total, page: Number(page), limit: Number(limit) },
      "Posts fetched"
    )
  );
});

// ─── Get a single tweet ───────────────────────────────────────────────────────
const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId).populate(
    "author",
    "name avatar role"
  );
  if (!tweet) throw new ApiError(404, "Post not found");

  return res.status(200).json(new ApiResponse(200, tweet, "Post fetched"));
});

// ─── Update a post ────────────────────────────────────────────────────────────
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content, topic } = req.body;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Post not found");

  if (tweet.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own posts");
  }

  if (content) tweet.content = content.trim();
  if (topic) tweet.topic = topic;

  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Post updated successfully"));
});

// ─── Delete a post ────────────────────────────────────────────────────────────
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Post not found");

  if (tweet.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own posts");
  }

  await tweet.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// ─── Get tweets by a specific user ───────────────────────────────────────────
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const tweets = await Tweet.find({ author: userId })
    .populate("author", "name avatar role")
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Tweet.countDocuments({ author: userId });

  return res.status(200).json(
    new ApiResponse(
      200,
      { tweets, total, page: Number(page) },
      "User posts fetched"
    )
  );
});

export {
  createTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
  getUserTweets,
};
