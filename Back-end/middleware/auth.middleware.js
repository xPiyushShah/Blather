import jwt from "jsonwebtoken";

import User from "../Models/user.model.js";

// export const protectAuth = async (req, res, next) => {
//   try {
//     const token = req.cookies.auth_token;

//     if (!token) return res.status(401).json({ message: "Not authorized, token is missing" });
    
//     const decoded = jwt.verify(token, process.env.JWT_PVTKEY);

//     if (!decoded) return res.status(401).json({ message: "Not authorized, token is invalid" });
    
//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) return res.status(404).json({ message: "User not found" });

//     req.user = user;

//     next();
//   } catch (err) {

//     console.error("Error occured by an auth middleware", err.message);

//     res.status(500).json({ message: "Server error" });
    
//   }
// };



export const protectAuth = async (req, res, next) => {
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
