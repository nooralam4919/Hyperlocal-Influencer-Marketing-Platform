import { Router } from "express";
import {
  getCreatorDashboardStats,
  getOwnerDashboardStats,
  getGlobalStats,
} from "../controllers/dashboard.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/authjs.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/creator", verifyRole("creator"), getCreatorDashboardStats);
router.get("/owner",   verifyRole("owner"),   getOwnerDashboardStats);
router.get("/global",                         getGlobalStats);

export default router;
