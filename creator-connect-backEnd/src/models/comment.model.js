import mongoose, { Schema } from "mongoose";

/**
 * Comment model.
 * Used for comments on community posts (tweets).
 */
const commentSchema = new Schema(
  {
    // Author of the comment
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The post this comment belongs to
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Comment content is required"],
      maxlength: [300, "Comment cannot exceed 300 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
