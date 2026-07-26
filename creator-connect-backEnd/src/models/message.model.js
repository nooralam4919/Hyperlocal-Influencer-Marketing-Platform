import mongoose, { Schema } from "mongoose";

/**
 * Message model.
 * Powers the direct messaging feature between owners and creators.
 */
const messageSchema = new Schema(
  {
    // Sender
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Receiver
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index to quickly retrieve conversations between two users
messageSchema.index({ sender: 1, receiver: 1 });

export const Message = mongoose.model("Message", messageSchema);
