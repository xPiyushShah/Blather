import express from "express";
import { protectAuth } from "../middleware/auth.middleware.js";
import {
  initializeCallLog,
  acceptCall,
  endCall,
  updateCallStatus,
} from "../Controllers/calling.controller.js";

const router = express.Router();
router.post("/initialize", protectAuth, initializeCallLog);
router.post("/accepted", protectAuth, acceptCall);
router.post("/end", protectAuth, endCall);
router.post("/status", protectAuth, updateCallStatus);


export default router;
