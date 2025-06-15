import bcrypt from "bcryptjs";
import User from "../Models/user.model.js";
import Friend from "../Models/Friend.model.js";
import { gToken } from "../libs/utils.js";
import cloudinary from "../libs/cloudinary.js";

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
    if (userID.toString() === friendID.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }
    const existingFriend = await Friend.findOne({
      $or: [
        { userId: userID, friendId: friendID },
        { userId: friendID, friendId: userID },
      ],
    });

    if (existingFriend) {
      return res.status(409).json({ message: "Friendship already exists." });
    }

    const newFriend = new Friend({
      userId: userID,
      friendId: friendID,
      createdBy: userID,
      status: "pending",
    });

    await newFriend.save();

    res.status(201).json({ message: "Friend added successfully." });
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const friendlist = async (req, res) => {
  try {
    const myId = req.user._id;

    const friends = await Friend.find({
      $and: [
        {
          $or: [{ userId: myId }, { friendId: myId }],
        },
        { status: "accepted" },
      ],
    });

    const friendIds = friends.map((f) =>
      f.userId.toString() === myId.toString() ? f.friendId : f.userId
    );

    const friendDetails = await User.find({ _id: { $in: friendIds } });

    res.status(200).json(friendDetails);
  } catch (error) {
    console.error("Error fetching friend list:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const myId = req.user._id;
    const { rqstID } = req.body;

    const updatedRequest = await Friend.findOneAndUpdate(
      { userId: rqstID, friendId: myId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!updatedRequest) {
      return res
        .status(404)
        .json({ message: "Friend request not found or already accepted." });
    }

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
