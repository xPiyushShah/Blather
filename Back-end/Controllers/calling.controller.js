import User from "../Models/user.model.js";
import Message from "../Models/message.model.js";
import { io, getReceiverSocketId } from "../socket.js";
import CallLog from "../Models/callLog.model.js";

export const saveCall = async (req, res) => {
  const CallLog = new CallLog({
    senderId: ,
    receiverId: req.body.receiverId,
    callType: req.body.callType,
    callStatus: "Pending",
  });
};
