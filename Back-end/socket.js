import { Server } from "socket.io";

import http from "http";

import { SendMessage } from "./helper/Message.js";

import express from "express";

import { config } from "dotenv";
config();

const app = express();

const server = http.createServer(app);
const userSocketMap = {};
const userStatusMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:5173"],
    origin: ["https://blather.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});


io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("userList", Object.keys(userSocketMap));

  //msg feature
  socket.on("send-message", async ({ from, data, to, time }) => {
    const receiverId = getReceiverSocketId(to);
    io.to(receiverId).emit("receive-message", data);
    if (data.text || data.image) {
      await SendMessage({
        senderId: from,
        receiverId: to,
        text: data.text,
        image: data.image,
        time,
      });
    }
  });

  // call feature
  socket.on("call-user", ({ signal, to, type }) => {
    const receiverId = getReceiverSocketId(to);

    if (userStatusMap[receiverId]) {
      io.emit("busy", { to });
    }

    userStatusMap[userId] = receiverId;
    io.emit("statusList", Object.keys(userStatusMap));

    io.to(receiverId).emit("incoming-call", {
      from: socket.id,
      signal,
      type,
    });
  });

  socket.on("answer-call", ({ signal, to, type }) => {
    userStatusMap[userId] = to;
    io.emit("statusList", Object.keys(userStatusMap));

    io.to(to).emit("call-accepted", {
      from: socket.id,
      signal,
      type,
    });
  });

  socket.on("reject-call", ({ to, from }) => {

    delete userStatusMap[socket.id];
    io.emit("statusList", Object.keys(userStatusMap));

    io.to(to).emit("reject-call", {
      to: to,
      from: socket.id,
    });
  });

  socket.onAny((event, data) => {
    // console.log("🔍 Event received:", event, data);
  });

  // features start for call--
  socket.on("toggle-media", (data) => {
    const { userId, receiverId, camera, mic } = data;

    // userMediaStatus[userId] = { camera, mic };
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {

      io.to(receiverSocketId).emit("video-bot", {
        userId,
        receiverId,
        camera,
      });

      io.to(receiverSocketId).emit("audio-bot", {
        userId,
        receiverId,
        mic,
      });
    }
  });
  // feature end for call--

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[socket.id];
    delete userStatusMap[socket.id];

    io.emit("userList", Object.keys(userSocketMap));
    io.emit("statusList", Object.keys(userStatusMap));
  });
});

export { io, app, server };
