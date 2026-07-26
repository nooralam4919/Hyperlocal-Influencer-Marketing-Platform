import { Router } from "express";
import {
  uploadVideo,
  getCreatorVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

// Upload a new video/media to portfolio
router.post(
  "/upload",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

// Get all videos for a creator
router.get("/creator/:creatorId", getCreatorVideos);

// Get, update, delete a specific video
router.route("/:videoId")
  .get(getVideoById)
  .patch(upload.single("thumbnail"), updateVideo)
  .delete(deleteVideo);

// Toggle publish/unpublish
router.patch("/:videoId/publish", togglePublishStatus);

export default router;
