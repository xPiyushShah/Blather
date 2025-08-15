import jwt from "jsonwebtoken";

import User from "../Models/user.model.js";



export const protectAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing", status : false });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_PVTKEY);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found", status : false });
    }

    req.user = user;
    // res.status(200).json(user);
    
    next();
    
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed", status : false  });
  }
};

// this one for cookie
export const protectAuths = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_PVTKEY);
    
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    // res.status(200).json(user);
    
    next();
    
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
