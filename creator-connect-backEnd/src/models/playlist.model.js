import mongoose, { Schema } from "mongoose";

/**
 * Playlist model.
 * Lets creators group their portfolio/video content into named collections.
 */
const playlistSchema = new Schema(
  {
    // Creator who owns the playlist
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Playlist name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // Array of Video IDs in this playlist
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
