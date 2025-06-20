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
    const userID = req.user._id.toString();

    // Step 1: Fetch all friend relationships involving current user
    const friends = await Friend.find({
      $or: [{ userId: userID }, { friendId: userID }],
    });

    const acceptedFriendIds = new Set();
    const pendingSentIds = new Set();
    const pendingReceivedIds = new Set();

    for (const f of friends) {
      const userIdStr = f.userId.toString();
      const friendIdStr = f.friendId.toString();

      if (f.status === "accepted") {
        const otherId = userIdStr === userID ? friendIdStr : userIdStr;
        acceptedFriendIds.add(otherId);
      } else if (f.status === "pending") {
        if (userIdStr === userID) {
          pendingSentIds.add(friendIdStr);
        } else if (friendIdStr === userID) {
          pendingReceivedIds.add(userIdStr);
        }
      }
    }

    // Step 2: Determine main_user (wait_user) IDs
    const excludedIds = new Set([
      userID,
      ...acceptedFriendIds,
      ...pendingSentIds,
    ]);

    // Get all user IDs excluding current user and relevant friend statuses
    const allUserIds = await User.find({ _id: { $ne: userID } }).select("_id");

    const waitUserIds = allUserIds
      .map((u) => u._id.toString())
      .filter((uid) => !excludedIds.has(uid));

    // Step 3: Combine both ID sets
    const userIdsToFetch = [
      ...new Set([...pendingReceivedIds, ...waitUserIds]),
    ];

    const usersMeta = await User.find({
      _id: { $in: userIdsToFetch },
    }).select("first_name last_name profile_url");

    // Step 4: Organize into pend_user and main_user
    const usersMap = new Map();
    usersMeta.forEach((user) => {
      usersMap.set(user._id.toString(), {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_url: user.profile_url,
      });
    });

    const pend_user = Array.from(pendingReceivedIds)
      .map((uid) => usersMap.get(uid))
      .filter(Boolean);

    const main_user = waitUserIds
      .map((uid) => usersMap.get(uid))
      .filter(Boolean);

    // Step 5: Send response
    res.status(200).json({
      pend_user,
      main_user,
    });
  } catch (error) {
    console.error("Error fetching sidebar users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSideBarUsersd = async (req, res) => {
  try {
    const userID = req.user._id.toString();

    // Get all friend relationships involving the user
    const friends = await Friend.find({
      $or: [{ userId: userID }, { friendId: userID }],
    });

    // Track accepted friends to exclude from main_user
    const acceptedFriendIds = new Set();
    const pendingStatusMap = new Map(); // userId <-> status "pending"

    // Determine status for each friend relation
    for (const f of friends) {
      const otherId =
        f.userId.toString() === userID
          ? f.friendId.toString()
          : f.userId.toString();

      if (f.status === "accepted") {
        acceptedFriendIds.add(otherId); // exclude from sidebar
      } else if (f.status === "pending") {
        pendingStatusMap.set(otherId, "pending");
      }
    }

    // Get all users except the current user and accepted friends
    const excludedIds = [userID, ...Array.from(acceptedFriendIds)];
    const allUsers = await User.find({
      _id: { $nin: excludedIds },
    }).select("first_name last_name profile_url");

    // Format main_user list with status
    const mainUsers = allUsers.map((user) => {
      const uid = user._id.toString();
      const status = pendingStatusMap.has(uid) ? "pending" : "none";
      return {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_url: user.profile_url,
        status,
      };
    });

    // Get users who sent you a friend request (pend_user)
    const pendRequests = friends.filter(
      (f) => f.status === "pending" && f.friendId.toString() === userID
    );
    const pendSenderIds = pendRequests.map((f) => f.userId);

    const pendUsers = await User.find({
      _id: { $in: pendSenderIds },
    }).select("first_name last_name profile_url");

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
