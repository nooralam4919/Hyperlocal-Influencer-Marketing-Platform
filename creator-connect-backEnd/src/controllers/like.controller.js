import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Toggle like on a community post (tweet) ──────────────────────────────────
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Post not found");

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    onPost: tweetId,
    onModel: "Tweet",
  });

  if (existingLike) {
    // Unlike
    await existingLike.deleteOne();
    if (tweet.likesCount > 0) {
      tweet.likesCount -= 1;
      await tweet.save({ validateBeforeSave: false });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: false, likesCount: tweet.likesCount },
          "Post unliked"
        )
      );
  } else {
    // Like
    await Like.create({ likedBy: req.user._id, onPost: tweetId, onModel: "Tweet" });
    tweet.likesCount += 1;
    await tweet.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: true, likesCount: tweet.likesCount },
          "Post liked"
        )
      );
  }
});

// ─── Toggle like on a community post alias (post) ────────────────────────────
const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Tweet.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    onPost: postId,
    onModel: "Tweet",
  });

  if (existingLike) {
    await existingLike.deleteOne();
    if (post.likesCount > 0) {
      post.likesCount -= 1;
      await post.save({ validateBeforeSave: false });
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: false, likesCount: post.likesCount },
          "Post unliked"
        )
      );
  } else {
    await Like.create({ likedBy: req.user._id, onPost: postId, onModel: "Tweet" });
    post.likesCount += 1;
    await post.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { liked: true, likesCount: post.likesCount },
          "Post liked"
        )
      );
  }
});

// ─── Get all posts liked by the current user ──────────────────────────────────
const getLikedPosts = asyncHandler(async (req, res) => {
  const likes = await Like.find({
    likedBy: req.user._id,
    onModel: "Tweet",
  }).populate({
    path: "onPost",
    populate: { path: "author", select: "name avatar role" },
  });

  const posts = likes.map((l) => l.onPost).filter(Boolean);

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Liked posts fetched"));
});

export { toggleTweetLike, togglePostLike, getLikedPosts };
