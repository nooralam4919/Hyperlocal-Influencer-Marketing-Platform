/**
 * Application-wide constants.
 */

// MongoDB database name
export const DB_NAME = "creator-connect";

// Supported niche categories (mirrors the frontend)
export const NICHES = [
  "Fashion",
  "Lifestyle",
  "Fitness",
  "Tech",
  "Gaming",
  "Beauty",
  "Comedy",
];

// Supported contact methods for collab requests
export const CONTACT_METHODS = ["email", "whatsapp", "instagram", "platform"];

// Collab request statuses
export const COLLAB_STATUSES = ["pending", "accepted", "declined", "completed"];

// Availability options
export const AVAILABILITY_OPTIONS = ["Available", "Busy", "Unavailable"];
