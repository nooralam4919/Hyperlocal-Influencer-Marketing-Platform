import mongoose, { Schema } from "mongoose";

/**
 * Brand Owner profile model.
 * Stores the profile data for business/brand users.
 */
const ownerSchema = new Schema(
  {
    // Link to the auth User document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    brandType: {
      type: String,
      trim: true,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "",
    },

    // Monthly/campaign budget range
    budget: {
      type: String,
      default: "",
    },

    // Preferred content niches
    niches: [{ type: String }],

    logo: {
      type: String,   // Cloudinary URL
      default: "",
    },
    logoPublicId: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // Saved / bookmarked creator IDs
    savedCreators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Creator",
      },
    ],
  },
  { timestamps: true }
);

export const Owner = mongoose.model("Owner", ownerSchema);
