import jwt from "jsonwebtoken";

import { randomBytes } from "crypto";

import redisClient from "./redisClient.js";
export const gToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_PVTKEY, {
    expiresIn: "7d",
  });

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: ".onrender.com", 
    path: "/",
  });
  return token;
  // res.cookie("auth_token", token, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });

  console.log("token for user:", userId, "is generated successfully", token);
};

export const generateSession = async (userId, res) => {
  const sessionId = randomBytes(16).toString("hex");

  await redisClient.set(sessionId, JSON.stringify({ userId }), {
    EX: 7 * 24 * 60 * 60,
  });

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return sessionId;
};
