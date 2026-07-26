import { Creator } from "../models/creator.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ─── Get all creators (with optional filters) ─────────────────────────────────
const getAllCreators = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    niche,
    city,
    availability,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const filter = {};
  if (niche && niche !== "All") filter.niche = niche;
  if (city) filter.city = new RegExp(city, "i");
  if (availability) filter.availability = availability;
  if (search) {
    filter.$or = [
      { niche: new RegExp(search, "i") },
    ];
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const [creators, total] = await Promise.all([
    Creator.find(filter)
      .populate("user", "name email")
      .sort({ [sortBy]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    Creator.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        creators,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      "Creators fetched"
    )
  );
});

// ─── Get creator by slug (public profile page) ────────────────────────────────
const getCreatorBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const creator = await Creator.findOne({ slug }).populate(
    "user",
    "name email avatar"
  );

  if (!creator) {
    throw new ApiError(404, `Creator with slug "${slug}" not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, creator, "Creator profile fetched"));
});

// ─── Get creator by MongoDB ID ────────────────────────────────────────────────
const getCreatorById = asyncHandler(async (req, res) => {
  const { creatorId } = req.params;

  const creator = await Creator.findById(creatorId).populate(
    "user",
    "name email avatar"
  );

  if (!creator) throw new ApiError(404, "Creator not found");

  return res
    .status(200)
    .json(new ApiResponse(200, creator, "Creator fetched"));
});

// ─── Get creator by user ID (for logged-in creator dashboard) ────────────────
const getMyCreatorProfile = asyncHandler(async (req, res) => {
  const creator = await Creator.findOne({ user: req.user._id }).populate(
    "user",
    "name email avatar"
  );

  if (!creator) {
    throw new ApiError(
      404,
      "Creator profile not found. Please complete your profile setup."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, creator, "My creator profile fetched"));
});

// ─── Update creator profile ───────────────────────────────────────────────────
const updateCreatorProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "username",
    "niche",
    "followers",
    "price",
    "city",
    "country",
    "distance",
    "availability",
    "responseTime",
    "bio",
    "since",
    "niches",
    "collabTypes",
    "badges",
    "trustScore",
    "stats",
    "engagement",
    "audienceData",
    "pricing",
    "collabHistory",
    "trustMetrics",
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const creator = await Creator.findOneAndUpdate(
    { user: req.user._id },
    updates,
    { new: true, runValidators: true }
  ).populate("user", "name email avatar");

  if (!creator) throw new ApiError(404, "Creator profile not found");

  return res
    .status(200)
    .json(new ApiResponse(200, creator, "Creator profile updated"));
});

// ─── Update creator avatar ────────────────────────────────────────────────────
const updateCreatorAvatar = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) throw new ApiError(400, "Avatar image is required");

  const creator = await Creator.findOne({ user: req.user._id });
  if (!creator) throw new ApiError(404, "Creator profile not found");

  // Remove old avatar from Cloudinary
  if (creator.avatarPublicId) {
    await deleteFromCloudinary(creator.avatarPublicId);
  }

  const uploaded = await uploadOnCloudinary(localPath, "creator/avatars");
  if (!uploaded) throw new ApiError(500, "Avatar upload failed");

  creator.avatar = uploaded.secure_url;
  creator.avatarPublicId = uploaded.public_id;
  await creator.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { avatar: creator.avatar },
        "Avatar updated successfully"
      )
    );
});

// ─── Update creator cover image ───────────────────────────────────────────────
const updateCreatorCoverImage = asyncHandler(async (req, res) => {
  const localPath = req.file?.path;
  if (!localPath) throw new ApiError(400, "Cover image is required");

  const creator = await Creator.findOne({ user: req.user._id });
  if (!creator) throw new ApiError(404, "Creator profile not found");

  if (creator.coverPublicId) {
    await deleteFromCloudinary(creator.coverPublicId);
  }

  const uploaded = await uploadOnCloudinary(localPath, "creator/covers");
  if (!uploaded) throw new ApiError(500, "Cover image upload failed");

  creator.coverImage = uploaded.secure_url;
  creator.coverPublicId = uploaded.public_id;
  await creator.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { coverImage: creator.coverImage },
        "Cover image updated"
      )
    );
});

// ─── Add portfolio item ───────────────────────────────────────────────────────
const addPortfolioItem = asyncHandler(async (req, res) => {
  const { type, brand, title, reach, engRate } = req.body;

  if (!type || !brand || !title) {
    throw new ApiError(400, "type, brand, and title are required");
  }

  const localPath = req.file?.path;
  let imageUrl = "";
  let imagePublicId = "";

  if (localPath) {
    const uploaded = await uploadOnCloudinary(localPath, "creator/portfolio");
    if (uploaded) {
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }
  }

  const creator = await Creator.findOneAndUpdate(
    { user: req.user._id },
    {
      $push: {
        portfolio: {
          type,
          brand,
          title,
          image: imageUrl,
          imagePublicId,
          reach: reach || "0",
          engRate: engRate || "0%",
        },
      },
    },
    { new: true }
  );

  if (!creator) throw new ApiError(404, "Creator profile not found");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        creator.portfolio[creator.portfolio.length - 1],
        "Portfolio item added"
      )
    );
});

// ─── Remove portfolio item ────────────────────────────────────────────────────
const removePortfolioItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const creator = await Creator.findOne({ user: req.user._id });
  if (!creator) throw new ApiError(404, "Creator profile not found");

  const item = creator.portfolio.id(itemId);
  if (!item) throw new ApiError(404, "Portfolio item not found");

  if (item.imagePublicId) {
    await deleteFromCloudinary(item.imagePublicId);
  }

  creator.portfolio.pull({ _id: itemId });
  await creator.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Portfolio item removed"));
});

// ─── Add a review to a creator ────────────────────────────────────────────────
const addReview = asyncHandler(async (req, res) => {
  const { creatorId } = req.params;
  const { role, rating, text, date } = req.body;

  if (!rating || !text?.trim()) {
    throw new ApiError(400, "rating and text are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const creator = await Creator.findByIdAndUpdate(
    creatorId,
    {
      $push: {
        reviews: {
          reviewer: req.user._id,
          name: req.user.name,
          role: role || "",
          avatar: req.user.avatar || "",
          rating: Number(rating),
          text: text.trim(),
          date: date || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        },
      },
    },
    { new: true }
  );

  if (!creator) throw new ApiError(404, "Creator not found");

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        creator.reviews[creator.reviews.length - 1],
        "Review submitted"
      )
    );
});

// ─── Search creators by name (text search) ───────────────────────────────────
const searchCreators = asyncHandler(async (req, res) => {
  const { q, niche, page = 1, limit = 12 } = req.query;

  if (!q?.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const filter = {
    $or: [
      { niche: new RegExp(q, "i") },
      { city: new RegExp(q, "i") },
      { bio: new RegExp(q, "i") },
    ],
  };

  if (niche && niche !== "All") filter.niche = niche;

  const [creators, total] = await Promise.all([
    Creator.find(filter)
      .populate("user", "name email avatar")
      .sort({ trustScore: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    Creator.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { creators, total, page: Number(page) },
      "Search results"
    )
  );
});

// ─── Save / unsave a creator (owner bookmarks) ────────────────────────────────
const toggleSaveCreator = asyncHandler(async (req, res) => {
  const { creatorId } = req.params;

  const creator = await Creator.findById(creatorId);
  if (!creator) throw new ApiError(404, "Creator not found");

  const existingSave = await Subscription.findOne({
    subscriber: req.user._id,
    creator: creatorId,
  });

  if (existingSave) {
    await existingSave.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, { saved: false }, "Creator removed from saved"));
  } else {
    await Subscription.create({ subscriber: req.user._id, creator: creatorId });
    return res
      .status(200)
      .json(new ApiResponse(200, { saved: true }, "Creator saved"));
  }
});

// ─── Get saved creators for the logged-in owner ───────────────────────────────
const getSavedCreators = asyncHandler(async (req, res) => {
  const saves = await Subscription.find({
    subscriber: req.user._id,
  }).populate({
    path: "creator",
    populate: { path: "user", select: "name email avatar" },
  });

  const creators = saves.map((s) => s.creator).filter(Boolean);

  return res
    .status(200)
    .json(new ApiResponse(200, creators, "Saved creators fetched"));
});

export {
  getAllCreators,
  getCreatorBySlug,
  getCreatorById,
  getMyCreatorProfile,
  updateCreatorProfile,
  updateCreatorAvatar,
  updateCreatorCoverImage,
  addPortfolioItem,
  removePortfolioItem,
  addReview,
  searchCreators,
  toggleSaveCreator,
  getSavedCreators,
};
