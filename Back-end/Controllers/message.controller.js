import User from "../Models/user.model.js";
import Message from "../Models/message.model.js";
import Friend from "../Models/friends.model.js";
import Action from "../Models/action.model.js";
import { io, getReceiverSocketId } from "../socket.js";
import cloudinary from "../libs/cloudinary.js";
import streamifier from "streamifier";


export const getAllUsers = async (req, res) => {
  const myId = req.user._id;

  try {
    // Step 1: Find all friendships involving me
    // const friends = await Friend.find({
    //   $or: [{ userId: myId }, { friendId: myId }],
    //   // status: { $in: ["accepted", "pending"] }, // optional
    // });

    // // Step 2: Get list of all friend IDs (regardless of who initiated)
    // const friendIds = friends.map((f) =>
    //   f.userId.toString() === myId.toString() ? f.friendId : f.userId
    // );

    // // Step 3: Find all users excluding me and my friends
    // const users = await User.find({
    //   _id: { $nin: [...friendIds, myId] }, // exclude friends and myself
    // }).select("-password");
    const users = await User.find({ _id: { $ne: myId } }).select("-password -token"); // Exclude password & token
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching sidebar users:", error.message);
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

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("receive-message", message);
    // }

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
export const likeMessage = (req, res) => performAction(req, res, "like", true);

export const unlikeMessage = (req, res) => performAction(req, res, "like", false);

export const starMessage = (req, res) => performAction(req, res, "star", true);

export const unstarMessage = (req, res) => performAction(req, res, "star", false);

export const getMessageActions = async (req, res) => {
  const { messageId } = req.params;

  try {
    const actions = await Action.find({ messageId })
      .populate("userId", "first_name last_name _id")
      .sort({ createdAt: -1 });

    res.status(200).json({ actions });
  } catch (error) {
    console.error("Error fetching actions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const performAction = async (req, res, actionType, isAdding) => {
  const userId = req.user._id;
  const messageId = req.body.messageId || req.params.messageId;

  try {
    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required." });
    }

    if (isAdding) {
      const exists = await Action.findOne({ messageId, userId, actionType });
      if (exists) {
        return res.status(409).json({ message: `Message already ${actionType}ed.` });
      }

      const newAction = new Action({ messageId, userId, actionType });
      await newAction.save();

      return res.status(201).json({ message: `Message ${actionType}ed successfully.` });
    } else {
      // Remove the action
      const deleted = await Action.findOneAndDelete({ messageId, userId, actionType });

      if (!deleted) {
        return res.status(404).json({ message: `Message not ${actionType}ed.` });
      }

      return res.status(200).json({ message: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} removed.` });
    }
  } catch (error) {
    console.error(`Error performing ${actionType}:`, error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
