import mongoose, { Schema } from "mongoose";

/**
 * Creator profile model.
 * Stores all the rich profile data shown on the creator public page.
 */

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const statSchema = new Schema({
  platform:  { type: String },
  followers: { type: String },
  label:     { type: String },
  color:     { type: String, default: "#ffffff" },
});

const engagementSchema = new Schema({
  rate:          { type: String },
  avgLikes:      { type: String },
  avgComments:   { type: String },
  avgViews:      { type: String },
  totalAudience: { type: String },
  growth:        { type: String },
});

const ageRangeSchema = new Schema({
  range: { type: String },
  pct:   { type: Number },
});

const locationSchema = new Schema({
  city: { type: String },
  pct:  { type: Number },
});

const audienceDataSchema = new Schema({
  ages:      [ageRangeSchema],
  gender: {
    female: { type: Number, default: 0 },
    male:   { type: Number, default: 0 },
    other:  { type: Number, default: 0 },
  },
  locations:  [locationSchema],
  languages:  [{ type: String }],
  localReach: { type: Number, default: 0 },
});

const portfolioItemSchema = new Schema({
  type:       { type: String, enum: ["image", "video"] },
  brand:      { type: String },
  title:      { type: String },
  image:      { type: String },  // Cloudinary URL
  imagePublicId: { type: String, default: "" },
  reach:      { type: String },
  engRate:    { type: String },
});

const pricingItemSchema = new Schema({
  type:          { type: String },
  price:         { type: String },
  deliverables:  { type: String },
  popular:       { type: Boolean, default: false },
});

const reviewSchema = new Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name:   { type: String },   // denormalised reviewer name
  role:   { type: String },   // e.g. "Marketing Director · Zara UK"
  avatar: { type: String },   // reviewer avatar URL
  rating: { type: Number, min: 1, max: 5 },
  text:   { type: String },
  date:   { type: String },   // human-readable e.g. "March 2025"
});

const trustMetricSchema = new Schema({
  label: { type: String },
  pct:   { type: Number },
});

// ─── Main schema ──────────────────────────────────────────────────────────────

const creatorSchema = new Schema(
  {
    // Link to the auth User document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // URL-friendly identifier used in /creator/:slug routing
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      trim: true,
    },

    niche: {
      type: String,
      required: true,
      enum: ["Fashion", "Lifestyle", "Fitness", "Tech", "Gaming", "Beauty", "Comedy"],
    },

    followers: { type: String, default: "0" },
    price:     { type: String, default: "$0" },

    city:    { type: String, trim: true },
    country: { type: String, trim: true },
    distance:{ type: String, default: "" },

    verified:     { type: Boolean, default: false },
    availability: {
      type: String,
      enum: ["Available", "Busy", "Unavailable"],
      default: "Available",
    },
    responseTime: { type: String, default: "< 24 hours" },
    trustScore:   { type: Number, default: 0 },

    avatar:       { type: String, default: "" },   // Cloudinary URL
    avatarPublicId:{ type: String, default: "" },
    coverImage:   { type: String, default: "" },   // Cloudinary URL
    coverPublicId: { type: String, default: "" },

    bio:   { type: String, default: "" },
    since: { type: String, default: "" },

    // Social media platform stats
    stats: [statSchema],

    engagement: engagementSchema,

    // Content niches / categories
    niches: [{ type: String }],

    audienceData: audienceDataSchema,

    portfolio: [portfolioItemSchema],

    pricing: [pricingItemSchema],

    collabHistory: {
      total:       { type: Number, default: 0 },
      repeatRate:  { type: String, default: "0%" },
      successRate: { type: String, default: "0%" },
      brands:      [{ type: String }],
    },

    reviews: [reviewSchema],

    badges: [{ type: String }],

    trustMetrics: [trustMetricSchema],

    collabTypes: [{ type: String }],
  },
  { timestamps: true }
);

// Compound index for fast niche + city lookups (used by search & niche pages)
creatorSchema.index({ niche: 1, city: 1 });

export const Creator = mongoose.model("Creator", creatorSchema);
