import { Router } from "express";
import {
  sendCollabRequest,
  getCreatorRequests,
  getOwnerRequests,
  updateRequestStatus,
  getRequestById,
  cancelRequest,
} from "../controllers/collab.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/authjs.middleware.js";

const router = Router();

router.use(verifyJWT); // All collab routes require auth

// Owner sends a request
router.post("/", verifyRole("owner"), sendCollabRequest);

// Owner views their sent requests
router.get("/owner", verifyRole("owner"), getOwnerRequests);

// Creator views requests they received
router.get("/creator", verifyRole("creator"), getCreatorRequests);

// Owner cancels a pending request
router.delete("/:requestId/cancel", verifyRole("owner"), cancelRequest);

// Get a single request's full details
router.get("/:requestId", getRequestById);

// Creator updates the status (accept / decline / complete)
router.patch("/:requestId/status", verifyRole("creator"), updateRequestStatus);

export default router;
