import bcrypt from "bcryptjs";
import User from "../Models/user.model.js"; // Correctly imported model
import Friend from "../Models/friend.model.js"; // Correctly imported model
import { gToken } from "../libs/utils.js"; // Your custom token utility
import cloudinary from "../libs/cloudinary.js"; // Your custom cloudinary utility

export const signup = async (req, res) => {
  const { first_name, last_name, email, password, profile_url } = req.body;

  try {
    // Validate password length
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length must be equal or greater than 6" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      profile_url,
    });

    await newUser.save();

    // Generate token
    gToken(newUser._id, res);

    // Send response
    res.status(201).json({
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    gToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, password, profile_url } = req.body;
    const userID = req.user._id;
    if (profile_url) {
      const uploadResult = await cloudinary.uploader.upload(profile_url);
    }
    if (userID) {
      const user = await User.findByIdAndUpdate(
        userID,
        {
          first_name,
          last_name,
          email,
          password,
          profile_url: uploadResult.secure_url,
        },
        { new: true }
      );
      res.status(200).json({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkUser = async (req, res) => {
  const userID = req.user._id;
  try {
    if (userID) {
      const user = await User.findById(userID).select("-password");
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  } catch (err) {
    res.status(401).json({ message: "Not authenticated" });
    console.error("Error to Integrate with data:", err.message);
  }
};

export const addFriend = async (req, res) => {
  const userID = req.user._id;
  const friendID = req.params.id;
  try {
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
