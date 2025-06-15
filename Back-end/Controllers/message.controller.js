import User from "../Models/user.model.js";
import Message from "../Models/message.model.js";
import Friend from "../Models/Friend.model.js";
import { io, getReceiverSocketId } from "../socket.js";

export const getSideBarUsers = async (req, res) => {
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
    } else {
      console.log("Socket ID not found for receiver:", receiverId);
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
