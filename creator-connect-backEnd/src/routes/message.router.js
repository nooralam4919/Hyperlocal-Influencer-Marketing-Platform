import { Router } from "express";
import {
  sendMessage,
  getConversation,
  getContacts,
  deleteMessage,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/authjs.middleware.js";

const router = Router();

router.use(verifyJWT); // All messaging routes require auth

router.post("/",                     sendMessage);
router.get ("/contacts",             getContacts);
router.get ("/conversation/:userId", getConversation);
router.delete("/:messageId",         deleteMessage);

export default router;
