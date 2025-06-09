import express from "express";

import { saveCall } from "../Controllers/calling.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("call-log", protectAuth, saveCall);

export default router;
