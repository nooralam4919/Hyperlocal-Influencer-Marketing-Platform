import { Router } from "express";
import {
  getAllCreators,
  getCreatorBySlug,
  getCreatorById,
  getMyCreatorProfile,
  updateCreatorProfile,
  updateCreatorAvatar,
  updateCreatorCoverImage,
  addPortfolioItem,
  removePortfolioItem,
  addReview,
  searchCreators,
  toggleSaveCreator,
  getSavedCreators,
} from "../controllers/creator.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/authjs.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────────
router.get("/",            getAllCreators);
router.get("/search",      searchCreators);
router.get("/slug/:slug",  getCreatorBySlug);
router.get("/:creatorId",  getCreatorById);

// ── Protected routes ───────────────────────────────────────────────────────────
router.use(verifyJWT);

// Creator-only routes (manages own profile)
router.get(
  "/me/profile",
  verifyRole("creator"),
  getMyCreatorProfile
);

router.patch(
  "/me/profile",
  verifyRole("creator"),
  updateCreatorProfile
);

router.patch(
  "/me/avatar",
  verifyRole("creator"),
  upload.single("avatar"),
  updateCreatorAvatar
);

router.patch(
  "/me/cover",
  verifyRole("creator"),
  upload.single("coverImage"),
  updateCreatorCoverImage
);

router.post(
  "/me/portfolio",
  verifyRole("creator"),
  upload.single("image"),
  addPortfolioItem
);

router.delete(
  "/me/portfolio/:itemId",
  verifyRole("creator"),
  removePortfolioItem
);

// Add review (any authenticated user can review a creator)
router.post("/:creatorId/reviews", addReview);

// Save/unsave a creator (owner only)
router.post(
  "/:creatorId/save",
  verifyRole("owner"),
  toggleSaveCreator
);

// Get saved creators for the current owner
router.get(
  "/owner/saved",
  verifyRole("owner"),
  getSavedCreators
);

export default router;
