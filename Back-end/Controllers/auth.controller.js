import bcrypt from "bcryptjs";
import Friend from "../Models/friends.model.js";
import User from "../Models/user.model.js";
import { gToken, generateSession } from "../libs/utils.js";
import cloudinary from "../libs/cloudinary.js";
import redisClient from "../libs/redisClient.js";
export const cookie = (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.status(200).json({ message: "Authenticated" });
};
export const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists", status: false });
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
    });

    await newUser.save();

    const session = await generateSession(user._id, res);

    // console.log(session);

    // Generate token
    // gToken(newUser._id, res);
    const token = gToken(newUser._id, res);

    await User.findByIdAndUpdate(newUser._id, { token: token }, { new: true });

    // res.status(201).json({ message: "User created successfully" });
    res.status(201).json({ message: "User created successfully", token  , status: true  });
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found", status: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password", status: false });

    const session = await generateSession(user._id, res);

    // console.log(session);

    // gToken(user._id, res);

    const token = gToken(user._id, res);
    await User.findByIdAndUpdate(user._id, { token: token }, { new: true });

    // res.status(200).json({ message: "You are logged in..!" });
    res.status(200).json({ message: "You are logged in..!", token   , status: false  });

    // res.status(200).json({
    //   _id: user._id,
    //   first_name: user.first_name,
    //   last_name: user.last_name,
    //   email: user.email,
    // });
  } catch (err) {
    // console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error", status: false });
  }
};
export const logout = async (req, res) => {
  // const sessionId = req.cookies.sessionId;

  // if (sessionId) {
  //   await redisClient.del(sessionId); // delete session from Redis
  // }
  const userID = req.user._id;
  // await User.findByIdAndUpdate(userID, { token: "" }, { new: true });

  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export const updateImage = async (req, res) => {
  try {
    const file = req.file;
    const userID = req.user._id;
    if (file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "profile_pics",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(buffer);
        });
      };

      const result = await streamUpload(file.buffer);

      const user = await User.findByIdAndUpdate(
        userID,
        {
          profile_url: result.secure_url,
        },
        { new: true }
      );
      res.status(200).json({ message: "Profile picture updated successfully" });
    }
  } catch (err) {
    console.error("Error to Integrate with data:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const userID = req.user._id;

    if (userID) {
      const user = await User.findByIdAndUpdate(
        userID,
        {
          first_name,
          last_name,
          email,
        },
        { new: true }
      );
      res.status(200).json({ message: "Profile updated successfully" });
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
        res.status(200).json({ user, status: true });
      } else {
        res.status(404).json({ message: "User not found", status: false });
      }
    }
  } catch (err) {
    res.status(401).json({ message: "Not authenticated", status: false });
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

    // const friends = await Friend.find({
    //   $and: [
    //     {
    //       $or: [{ userId: myId }, { friendId: myId }],
    //     },
    //     { status: "accepted" },
    //   ],
    // });

    // const friendIds = friends.map((f) =>
    //   f.userId.toString() === myId.toString() ? f.friendId : f.userId
    // );

    // const friendDetails = await User.find({ _id: { $in: friendIds } });

    const users = await User.find({
      _id: { $nin: myId },
    }).select("-password");

    res.status(200).json(users);
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

export const userData = async (req, res) => {
  try {
    const rqstID = req.params.id;
    if (rqstID) {
      const user = await User.findById(rqstID).select("-password");
      if (user) {
        res.status(200).json({ user, status: true });
      } else {
        res.status(404).json({ message: "User not found", status: false });
      }
    }
  } catch (err) {
    console.error("Error to get  data:", err.message);
  }
};
