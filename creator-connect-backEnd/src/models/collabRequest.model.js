import mongoose, { Schema } from "mongoose";

/**
 * CollabRequest model.
 * Created when an owner sends a collaboration request to a creator.
 */
const collabRequestSchema = new Schema(
  {
    // The owner who sent the request
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The creator being requested
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },

    // Optional message / brief from the owner
    message: {
      type: String,
      default: "",
      maxlength: [2000, "Message cannot exceed 2000 characters"],
      trim: true,
    },

    // Pricing package requested
    packageType: {
      type: String,
      default: "",
    },

    // Budget offered
    budget: {
      type: String,
      default: "",
    },

    // Campaign details
    campaignDetails: {
      type: String,
      default: "",
      trim: true,
    },

    // Contact preference
    contactMethod: {
      type: String,
      enum: ["email", "whatsapp", "instagram", "platform"],
      default: "platform",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed"],
      default: "pending",
    },

    // Creator's reply to the request
    reply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const CollabRequest = mongoose.model("CollabRequest", collabRequestSchema);
