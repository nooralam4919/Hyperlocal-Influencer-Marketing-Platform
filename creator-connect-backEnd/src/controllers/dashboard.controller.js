import { Creator } from "../models/creator.model.js";
import { Owner } from "../models/owner.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Creator dashboard stats ──────────────────────────────────────────────────
const getCreatorDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [creator, videoCount, totalViews, savedByCount] = await Promise.all([
    Creator.findOne({ user: userId }),
    Video.countDocuments({ owner: userId }),
    Video.aggregate([
      { $match: { owner: userId } },
      { $group: { _id: null, total: { $sum: "$viewsCount" } } },
    ]),
    Subscription.countDocuments({ creator: userId }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: creator,
        totalVideos: videoCount,
        totalViews: totalViews[0]?.total || 0,
        savedByOwners: savedByCount,
        trustScore: creator?.trustScore || 0,
        availability: creator?.availability || "Available",
      },
      "Creator dashboard stats fetched"
    )
  );
});

// ─── Owner dashboard stats ────────────────────────────────────────────────────
const getOwnerDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [owner, savedCount, totalCreators, recentPosts] = await Promise.all([
    Owner.findOne({ user: userId }).populate("savedCreators", "name niche followers trustScore avatar"),
    Subscription.countDocuments({ subscriber: userId }),
    Creator.countDocuments(),
    Tweet.find()
      .populate("author", "name avatar role")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        profile: owner,
        savedCreators: savedCount,
        totalCreatorsOnPlatform: totalCreators,
        recentCommunityPosts: recentPosts,
      },
      "Owner dashboard stats fetched"
    )
  );
});

// ─── Admin / global stats ─────────────────────────────────────────────────────
const getGlobalStats = asyncHandler(async (req, res) => {
  const [creators, owners, posts, videos] = await Promise.all([
    Creator.countDocuments(),
    Owner.countDocuments(),
    Tweet.countDocuments(),
    Video.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { creators, owners, posts, videos },
      "Global stats fetched"
    )
  );
});

export { getCreatorDashboardStats, getOwnerDashboardStats, getGlobalStats };
