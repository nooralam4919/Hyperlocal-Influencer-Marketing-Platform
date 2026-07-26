import { Router } from "express";
import {
  addComment,
  getTweetComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";

const router = Router();

router.use(verifyJWT); // All comment routes require auth

// Comments on a specific post (tweet)
router.route("/tweet/:tweetId")
  .get(getTweetComments)
  .post(addComment);

// Individual comment operations
router.route("/:commentId")
  .patch(updateComment)
  .delete(deleteComment);

export default router;
