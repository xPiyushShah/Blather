import { Server } from "socket.io";

import http from "http";

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
    origin: [process.env.FRONTEND_URL_R],
  },
});
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("userList", Object.keys(userSocketMap));

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

  socket.on("reject-call", ({ to }) => {
    delete userStatusMap[socket.id];
    io.emit("statusList", Object.keys(userStatusMap));

    io.to(to).emit("reject-call", {
      from: socket.id,
    });
  });

  socket.onAny((event, data) => {
    // console.log("🔍 Event received:", event, data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[socket.id];
    delete userStatusMap[socket.id];

    io.emit("userList", Object.keys(userSocketMap));
    io.emit("statusList", Object.keys(userStatusMap));
  });
});

export { io, app, server };
