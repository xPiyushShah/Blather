import mongoose from "mongoose";

const callLog = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callStartTime: {
      type: Date,
      required: true,
    },
    callEndTime: {
      type: Date,
    },
    duration: {
      type: Number,
    },
    callStatus: {
      type: String,
      enum: ["incoming", "outgoing", "missed", "cancelled"],
      required: true,
    },
    callType: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("CallLog", callLog);
