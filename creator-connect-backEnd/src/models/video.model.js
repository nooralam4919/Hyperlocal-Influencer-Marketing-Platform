import mongoose, { Schema } from "mongoose";

/**
 * Video / Portfolio content model.
 * Stores media content uploaded by creators for their portfolio.
 */
const videoSchema = new Schema(
  {
    // The creator who owns this media
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary video URL
    videoFile: {
      type: String,
      default: "",
    },
    videoPublicId: {
      type: String,
      default: "",
    },

    // Cloudinary thumbnail/image URL
    thumbnail: {
      type: String,
      default: "",
    },
    thumbnailPublicId: {
      type: String,
      default: "",
    },

    // Duration in seconds
    duration: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    // Brand this content was made for
    brand: {
      type: String,
      default: "",
    },

    // Engagement stats
    reach: {
      type: String,
      default: "0",
    },

    engagementRate: {
      type: String,
      default: "0%",
    },
  },
  { timestamps: true }
);

videoSchema.index({ owner: 1 });

export const Video = mongoose.model("Video", videoSchema);
