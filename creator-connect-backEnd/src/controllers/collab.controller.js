import { CollabRequest } from "../models/collabRequest.model.js";
import { Creator } from "../models/creator.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

// ─── Send a collab request (owner only) ──────────────────────────────────────
const sendCollabRequest = asyncHandler(async (req, res) => {
  const { creatorId, message, packageType, budget, campaignDetails, contactMethod } =
    req.body;

  if (!creatorId) {
    throw new ApiError(400, "creatorId is required");
  }

  const creator = await Creator.findById(creatorId);
  if (!creator) throw new ApiError(404, "Creator not found");

  // Prevent duplicate pending requests
  const existing = await CollabRequest.findOne({
    owner: req.user._id,
    creator: creatorId,
    status: "pending",
  });

  if (existing) {
    throw new ApiError(
      409,
      "You already have a pending request with this creator"
    );
  }

  const request = await CollabRequest.create({
    owner: req.user._id,
    creator: creatorId,
    message: message?.trim() || "",
    packageType: packageType || "",
    budget: budget || "",
    campaignDetails: campaignDetails?.trim() || "",
    contactMethod: contactMethod || "platform",
  });

  const populated = await request.populate([
    { path: "owner", select: "name email avatar" },
    { path: "creator", populate: { path: "user", select: "name avatar" } },
  ]);

  return res
    .status(201)
    .json(new ApiResponse(201, populated, "Collab request sent"));
});

// ─── Get all requests received by a creator ───────────────────────────────────
const getCreatorRequests = asyncHandler(async (req, res) => {
  const creator = await Creator.findOne({ user: req.user._id });
  if (!creator) throw new ApiError(404, "Creator profile not found");

  const { status, page = 1, limit = 10 } = req.query;
  const filter = { creator: creator._id };
  if (status) filter.status = status;

  const [requests, total] = await Promise.all([
    CollabRequest.find(filter)
      .populate("owner", "name email avatar")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    CollabRequest.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { requests, total, page: Number(page) },
      "Collab requests fetched"
    )
  );
});

// ─── Get all requests sent by an owner ───────────────────────────────────────
const getOwnerRequests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { owner: req.user._id };
  if (status) filter.status = status;

  const [requests, total] = await Promise.all([
    CollabRequest.find(filter)
      .populate({
        path: "creator",
        populate: { path: "user", select: "name avatar" },
      })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit)),
    CollabRequest.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      { requests, total, page: Number(page) },
      "My collab requests fetched"
    )
  );
});

// ─── Update request status (creator accepts/declines) ────────────────────────
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { status, reply } = req.body;

  if (!["accepted", "declined", "completed"].includes(status)) {
    throw new ApiError(400, "status must be accepted, declined, or completed");
  }

  const request = await CollabRequest.findById(requestId).populate("creator");

  if (!request) throw new ApiError(404, "Request not found");

  // Only the creator can accept / decline
  if (request.creator.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the creator can update this request");
  }

  request.status = status;
  if (reply) request.reply = reply.trim();
  await request.save();

  return res
    .status(200)
    .json(new ApiResponse(200, request, `Request ${status}`));
});

// ─── Get a single request detail ─────────────────────────────────────────────
const getRequestById = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await CollabRequest.findById(requestId)
    .populate("owner", "name email avatar")
    .populate({
      path: "creator",
      populate: { path: "user", select: "name avatar" },
    });

  if (!request) throw new ApiError(404, "Request not found");

  return res
    .status(200)
    .json(new ApiResponse(200, request, "Request details fetched"));
});

// ─── Delete / cancel a request (owner only) ──────────────────────────────────
const cancelRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await CollabRequest.findById(requestId);
  if (!request) throw new ApiError(404, "Request not found");

  if (request.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the owner who sent the request can cancel it");
  }

  if (request.status !== "pending") {
    throw new ApiError(400, "Only pending requests can be cancelled");
  }

  await request.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Request cancelled"));
});

export {
  sendCollabRequest,
  getCreatorRequests,
  getOwnerRequests,
  updateRequestStatus,
  getRequestById,
  cancelRequest,
};
