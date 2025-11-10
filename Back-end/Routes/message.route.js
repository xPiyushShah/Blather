import express from "express";
import {
  getAllUsers, getMessages, sendMessage, sendMedia
  , likeMessage,
  unlikeMessage,
  starMessage,
  unstarMessage,
  getMessageActions,
} from "../Controllers/message.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

// Import routes

// Register routes
router.post("/users", protectAuth, getAllUsers);

router.post("/:id", protectAuth, getMessages); //getting conversations by user id

router.post("/send-msg/:id", protectAuth, sendMessage);

router.post("/like", protectAuth, likeMessage);
router.delete("/like/:messageId", protectAuth, unlikeMessage);

// ⭐ Star / Unstar
router.post("/star", protectAuth, starMessage);
router.delete("/star/:messageId", protectAuth, unstarMessage);

// 🔍 Get all actions on a message
router.get("/actions/:messageId", protectAuth, getMessageActions);

router.post("/send-media/:id", protectAuth, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), sendMedia);
// router.post("/send-call/:id", protectAuth, sendMessage);
export default router;
