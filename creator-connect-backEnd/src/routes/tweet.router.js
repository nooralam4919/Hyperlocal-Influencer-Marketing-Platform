import { Router } from "express";
import {
  createTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
  getUserTweets,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";

const router = Router();

// Public: read the community feed without logging in
router.get("/",           getAllTweets);
router.get("/:tweetId",   getTweetById);
router.get("/user/:userId", getUserTweets);

// Protected
router.use(verifyJWT);

router.post("/",           createTweet);
router.patch("/:tweetId",  updateTweet);
router.delete("/:tweetId", deleteTweet);

export default router;
