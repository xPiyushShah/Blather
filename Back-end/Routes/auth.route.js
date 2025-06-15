import express from "express";
import {
  login,
  signup,
  logout,
  updateProfile,
  checkUser,
  addFriend,
  friendlist,
  acceptRequest,
} from "../Controllers/auth.controller.js";
import { protectAuth } from "../middleware/auth.middleware.js"; // Your protected route

const router = express.Router();

router.post("/login", login);

router.post("/register", signup);

router.get("/logout", logout);

router.put("/update-profile", protectAuth, updateProfile);

router.get("/check-auth", protectAuth, checkUser);

router.post("/addfriend/:id", protectAuth, addFriend);

router.get("/friendlist", protectAuth, friendlist);

router.get("/accept_reqst/:id", protectAuth, acceptRequest);
export default router;
