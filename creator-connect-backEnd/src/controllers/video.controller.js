import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

// ─── Upload a new portfolio video / media ─────────────────────────────────────
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, brand, reach, engagementRate } = req.body;

  if (!title?.trim()) {
    throw new ApiError(400, "Title is required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  const [videoUpload, thumbUpload] = await Promise.all([
    uploadOnCloudinary(videoLocalPath, "portfolio/videos"),
    thumbLocalPath
      ? uploadOnCloudinary(thumbLocalPath, "portfolio/thumbnails")
      : Promise.resolve(null),
  ]);

  if (!videoUpload) {
    throw new ApiError(500, "Video upload failed");
  }

  const video = await Video.create({
    owner: req.user._id,
    title: title.trim(),
    description: description?.trim() || "",
    videoFile: videoUpload.secure_url,
    videoPublicId: videoUpload.public_id,
    thumbnail: thumbUpload?.secure_url || "",
    thumbnailPublicId: thumbUpload?.public_id || "",
    duration: videoUpload.duration || 0,
    brand: brand?.trim() || "",
    reach: reach || "0",
    engagementRate: engagementRate || "0%",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
});

// ─── Get all videos for a creator ─────────────────────────────────────────────
const getCreatorVideos = asyncHandler(async (req, res) => {
  const { creatorId } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const videos = await Video.find({ owner: creatorId, isPublished: true })
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Video.countDocuments({
    owner: creatorId,
    isPublished: true,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { videos, total, page: Number(page), limit: Number(limit) },
      "Videos fetched"
    )
  );
});

// ─── Get single video ─────────────────────────────────────────────────────────
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate(
    "owner",
    "name avatar role"
  );
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Increment view count
  video.viewsCount += 1;
  await video.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, video, "Video fetched"));
});

// ─── Update video details ─────────────────────────────────────────────────────
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, brand, reach, engagementRate } = req.body;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to update this video");
  }

  // Handle optional thumbnail replacement
  const thumbLocalPath = req.file?.path;
  if (thumbLocalPath) {
    if (video.thumbnailPublicId) {
      await deleteFromCloudinary(video.thumbnailPublicId);
    }
    const uploaded = await uploadOnCloudinary(
      thumbLocalPath,
      "portfolio/thumbnails"
    );
    if (uploaded) {
      video.thumbnail = uploaded.secure_url;
      video.thumbnailPublicId = uploaded.public_id;
    }
  }

  if (title) video.title = title.trim();
  if (description !== undefined) video.description = description.trim();
  if (brand) video.brand = brand.trim();
  if (reach) video.reach = reach;
  if (engagementRate) video.engagementRate = engagementRate;

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

// ─── Delete video ─────────────────────────────────────────────────────────────
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to delete this video");
  }

  // Remove files from Cloudinary
  await Promise.all([
    video.videoPublicId ? deleteFromCloudinary(video.videoPublicId) : null,
    video.thumbnailPublicId
      ? deleteFromCloudinary(video.thumbnailPublicId)
      : null,
  ]);

  await video.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// ─── Toggle publish status ────────────────────────────────────────────────────
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        `Video ${video.isPublished ? "published" : "unpublished"}`
      )
    );
});

export {
  uploadVideo,
  getCreatorVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
