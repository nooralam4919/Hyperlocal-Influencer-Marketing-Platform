import mongoose, { Schema } from "mongoose";

/**
 * Like model — used for community posts and portfolio items.
 * Uses a polymorphic pattern (onModel) so one schema handles both.
 */
const likeSchema = new Schema(
  {
    // The user who liked
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The document being liked — could be a CommunityPost or PortfolioItem
    onPost: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "onModel",
    },

    onModel: {
      type: String,
      enum: ["CommunityPost", "Tweet"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes from the same user
likeSchema.index({ likedBy: 1, onPost: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
