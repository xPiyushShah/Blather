import User from "../Models/user.model.js";
import Message from "../Models/message.model.js";
import Friend from "../Models/friends.model.js";
import { io, getReceiverSocketId } from "../socket.js";
import cloudinary from "../libs/cloudinary.js";
import streamifier from "streamifier";

// export const getSideBarUsers = async (req, res) => {
//   try {
//     const userID = req.user._id;

//     const friends = await Friend.find({
//       $or: [{ userId: userID }, { friendId: userID }],
//     });

//     const friendIds = friends
//       .filter((f) => f.status === "accepted")
//       .map((f) =>
//         f.userId.toString() === userID.toString() ? f.friendId : f.userId
//       );

//     const excludedIds = [userID, ...friendIds];

//     const users = await User.find({
//       _id: { $nin: excludedIds },
//     }).select("-password");

//     const main_user = users.map((user) => {
//       return {
//         ...user._doc,
//         status: "none",
//       };
//     });

//     const pendingRequests = friends.filter(
//       (f) =>
//         f.status === "pending" && f.friendId.toString() === userID.toString()
//     );

//     const waitUserIds = pendingRequests.map((f) => f.userId);

//     const waitUsersRaw = await User.find({
//       _id: { $in: waitUserIds },
//     }).select("-password");

//     const wait_user = waitUsersRaw.map((user) => {
//       const friendData = pendingRequests.find(
//         (f) => f.userId.toString() === user._id.toString()
//       );
//       return {
//         ...user._doc,
//         status: friendData?.status || "pending",
//       };
//     });

//     res.status(200).json({ main_user, wait_user });
//   } catch (error) {
//     console.error("Error fetching users:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getSideBarUsers = async (req, res) => {
  try {
    const userID = req.user._id;

    // Get all users (excluding current user)
    const allUsers = await User.find({ _id: { $ne: userID } }).select("first_name last_name profile_url");

    // Get all friend relationships for this user
    const friends = await Friend.find({
      $or: [{ userId: userID }, { friendId: userID }],
    });

    // Build a map of friend statuses by userId
    const friendStatusMap = new Map();

    for (const f of friends) {
      const friendId =
        f.userId.toString() === userID.toString()
          ? f.friendId.toString()
          : f.userId.toString();

      // Prioritize accepted > pending
      if (f.status === "accepted") {
        friendStatusMap.set(friendId, "accepted");
      } else if (!friendStatusMap.has(friendId)) {
        friendStatusMap.set(friendId, "pending");
      }
    }

    // Find pending requests sent TO current user (for pend_user)
    const pendFriendUsers = friends
      .filter(
        (f) =>
          f.status === "pending" && f.friendId.toString() === userID.toString()
      )
      .map((f) => f.userId.toString());

    const pendUsers = await User.find({
      _id: { $in: pendFriendUsers },
    }).select("first_name last_name profile_url");

    // main_user = all users + relationship status
    const mainUsers = allUsers.map((user) => {
      const userIdStr = user._id.toString();
      const status = friendStatusMap.get(userIdStr) || "none";
      return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_url: user.profile_url,
        status,
      };
    });

    res.status(200).json({
      main_user: mainUsers,
      pend_user: pendUsers,
    });
  } catch (error) {
    console.error("Error fetching sidebar users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSideBarUserss = async (req, res) => {
  try {
    const userID = req.user._id;

    const friends = await Friend.find({
      $or: [{ userId: userID }, { friendId: userID }],
    });

    const friendIds = friends
      .filter((f) => f.status === "accepted")
      .map((f) =>
        f.userId.toString() === userID.toString() ? f.friendId : f.userId
      );

    const excludedIds = [userID, ...friendIds];

    const users = await User.find({
      _id: { $nin: excludedIds },
    }).select("-password");

    const pendingRequests = friends.filter(
      (f) =>
        f.status === "pending" && f.friendId.toString() === userID.toString()
    );

    const pendingUserIds = pendingRequests.map((f) => f.userId);
    const waitUsers = await User.find({
      _id: { $in: pendingUserIds },
    }).select("-password");

    res.status(200).json({ main_user: users, wait_user: waitUsers });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const receiverId = req.params.id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    });
    //   .populate("sender", "first_name last_name")
    //   .sort({ createdAt: 1 })
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error to fetch messages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error to send message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const sendMedia = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    const audioFile = req.files?.audio?.[0];
    const videoFile = req.files?.video?.[0];

    if (!audioFile && !videoFile) {
      return res.status(400).json({ message: "No media provided" });
    }

    let audioUrl = "";
    let videoUrl = "";

    const uploadToCloudinary = (fileBuffer, resource_type) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    };

    if (audioFile) {
      audioUrl = await uploadToCloudinary(audioFile.buffer, "raw");
    }

    if (videoFile) {
      videoUrl = await uploadToCloudinary(videoFile.buffer, "video");
    }

    const message = new Message({
      senderId,
      receiverId,
      audio: audioUrl,
      video: videoUrl,
    });

    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message", message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error to send message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageID = req.params.id;
    const senderId = req.user._id;
    const message = await Message.findById(messageID);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await message.remove();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error to delete message:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
