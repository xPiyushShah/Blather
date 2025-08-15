
import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["not","pending", "accepted", "rejected", "block" ],
      default: "not",
    },
  },
  { timestamps: true }
);

const Friend = mongoose.models.Friend || mongoose.model("Friend", FriendSchema);
export default Friend;
