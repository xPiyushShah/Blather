import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/db.js";

import { app, server } from "./socket.js";

//routes
import authRoutes from "./Routes/auth.route.js";
import msgRoutes from "./Routes/message.route.js";

dotenv.config();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "https://blather.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//auth route call
app.use("/api/auth", authRoutes);

app.use("/api/messages", msgRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/api/auth", (req, res) => {
  res.send("Not Found");
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectDB();
});
