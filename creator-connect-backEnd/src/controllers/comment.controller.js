import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Add comment to a post (tweet) ───────────────────────────────────────────
const addComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Post not found");

  const comment = await Comment.create({
    author: req.user._id,
    tweet: tweetId,
    content: content.trim(),
  });

  // Increment comment count on the parent tweet
  tweet.commentsCount += 1;
  await tweet.save({ validateBeforeSave: false });

  const populated = await comment.populate("author", "name avatar role");

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Comment added"));
});

// ─── Get all comments for a post ──────────────────────────────────────────────
const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const comments = await Comment.find({ tweet: tweetId })
    .populate("author", "name avatar role")
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Comment.countDocuments({ tweet: tweetId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comments, total, page: Number(page), limit: Number(limit) },
        "Comments fetched"
      )
    );
});

// ─── Update a comment ─────────────────────────────────────────────────────────
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own comments");
  }

  comment.content = content.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated"));
});

// ─── Delete a comment ─────────────────────────────────────────────────────────
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own comments");
  }

  const tweet = await Tweet.findById(comment.tweet);
  if (tweet && tweet.commentsCount > 0) {
    tweet.commentsCount -= 1;
    await tweet.save({ validateBeforeSave: false });
  }

  await comment.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted"));
});

export { addComment, getTweetComments, updateComment, deleteComment };
