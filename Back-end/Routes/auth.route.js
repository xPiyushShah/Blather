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
  updateImage,
  cookie,
  userData
} from "../Controllers/auth.controller.js";
import upload from "../middleware/multer.middleware.js";
import { protectAuth } from "../middleware/auth.middleware.js";
import { sessionMiddleware } from "../middleware/session.middleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", signup);

router.get("/logout", protectAuth, logout);

// router.get("/v1/health-check", (req, res) => {
//   res.status(200).json({
//     status: "ok",
//     message: "Server is healthy",
//   });
// });

router.get("/cookie", cookie);

router.get("/find-user:id", protectAuth, userData);

router.put("/update-profile", protectAuth, updateProfile);

router.put("/update-image", protectAuth, upload.single('image'), updateImage);

router.get("/check-auth", protectAuth, checkUser);

router.post("/addfriend/:id", protectAuth, addFriend);

router.get("/friendlist", protectAuth, friendlist);

router.get("/accept_reqst/:id", protectAuth, acceptRequest);
export default router;
