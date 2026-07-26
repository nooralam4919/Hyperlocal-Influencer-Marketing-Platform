import mongoose, { Schema } from "mongoose";

/**
 * Tweet / Community Post model.
 * Powers the Community feed in the owner dashboard.
 * Named "tweet" to match the structure image provided.
 */
const tweetSchema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Post content is required"],
      maxlength: [500, "Post cannot exceed 500 characters"],
      trim: true,
    },

    // Optional topic tag
    topic: {
      type: String,
      enum: ["Campaigns", "Tips", "Collabs", "Announcements", "General"],
      default: "General",
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
