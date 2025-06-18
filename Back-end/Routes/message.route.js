import express from "express";
import { getSideBarUsers ,getMessages, sendMessage ,sendMedia} from "../Controllers/message.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";
import upload  from "../middleware/multer.middleware.js";
const router = express.Router();

// Import routes

// Register routes
router.post("/users", protectAuth, getSideBarUsers);

router.get("/:id", protectAuth, getMessages); //getting conversations by user id

router.post("/send-msg/:id", protectAuth, sendMessage);

router.post("/send-media/:id", protectAuth,   upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]), sendMedia);
// router.post("/send-call/:id", protectAuth, sendMessage);
export default router;
