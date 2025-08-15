import mongoose from "mongoose";

const MessageActionSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: {
      type: String,
      enum: ["like", "star", "pin"], // expand later if needed
      default: "like",
    }
  },
  { timestamps: true } // will create `createdAt` and `updatedAt`
);

const action = mongoose.models.Message_Action || mongoose.model("Message_Action", MessageActionSchema);

export default action;
