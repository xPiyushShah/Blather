import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  checkUser,
  addFriend,
} from "../Controllers/auth.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js"; // Your protected route

const router = express.Router();

router.post("/login", login);

router.post("/register", signup);

router.get("/logout", logout);

router.put("/update-profile", protectAuth, updateProfile);

router.get("/check-auth", protectAuth, checkUser);

router.get("/addfriend/:id", protectAuth, addFriend);

export default router;
