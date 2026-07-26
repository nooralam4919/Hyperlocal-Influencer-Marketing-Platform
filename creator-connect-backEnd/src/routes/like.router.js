import { Router } from "express";
import {
  toggleTweetLike,
  togglePostLike,
  getLikedPosts,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/tweet/:tweetId", toggleTweetLike);
router.post("/post/:postId",   togglePostLike);
router.get ("/posts",          getLikedPosts);

export default router;
