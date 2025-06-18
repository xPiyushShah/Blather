import mongoose from "mongoose";

const message = new mongoose.Schema({
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
  seenAt: {
    type: String,
    default: false,
  },
  image: {
    type: String,
    default: null,
  },
  audio: {
    type: String,
    default: null,
  },
  video: {
    type: String,
    default: null,
  },
  text: {
    type: String,
  },
},{timestamps: true});
const Message = mongoose.model("Message", message);
export default Message;
