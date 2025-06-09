import express from "express";
import { getSideBarUsers ,getMessages, sendMessage} from "../Controllers/message.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

// Import routes

// Register routes
router.get("/users", protectAuth, getSideBarUsers);

router.get("/:id", protectAuth, getMessages); //getting conversations by user id

router.post("/send-msg/:id", protectAuth, sendMessage);

// router.post("/send-call/:id", protectAuth, sendMessage);
export default router;
