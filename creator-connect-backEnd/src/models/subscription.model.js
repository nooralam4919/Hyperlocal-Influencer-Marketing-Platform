import mongoose, { Schema } from "mongoose";

/**
 * Subscription / bookmark model.
 * Tracks which owners have saved/subscribed to which creators.
 */
const subscriptionSchema = new Schema(
  {
    // The owner who saved the creator
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The creator being saved/followed
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves
subscriptionSchema.index({ subscriber: 1, creator: 1 }, { unique: true });

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
