import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateAccountDetails,
  changeCurrentPassword,
  updateAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ── Public routes ──────────────────────────────────────────────────────────────
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login",    loginUser);
router.post("/refresh",  refreshAccessToken);

// ── Protected routes ───────────────────────────────────────────────────────────
router.use(verifyJWT); // All routes below require auth

router.post("/logout",              logoutUser);
router.get ("/me",                  getCurrentUser);
router.patch("/update-account",     updateAccountDetails);
router.patch("/change-password",    changeCurrentPassword);
router.patch("/avatar", upload.single("avatar"), updateAvatar);

export default router;
