import CallLog from "../Models/calling.model.js";
import User from "../Models/user.model.js";

/**
 * @desc Initialize a new call log when a call is started
 */
export const initializeCallLog = async (req, res) => {
  const { receiverId, callType } = req.body;
  const senderId = req.user._id;

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const callLog = new CallLog({
      senderId,
      receiverId,
      callType,
      callStatus: "outgoing",
      callStartTime: new Date(),
    });

    await callLog.save();

    res.status(201).json({
      message: "Call initialized",
      callLogId: callLog._id,
    });
  } catch (error) {
    console.error("Error initializing call log:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Mark the call as accepted and update the start time
 */
export const acceptCall = async (req, res) => {
  const { callLogId } = req.body;

  try {
    const callLog = await CallLog.findById(callLogId);
    if (!callLog) {
      return res.status(404).json({ message: "Call log not found" });
    }

    callLog.callStatus = "accepted";
    callLog.callStartTime = new Date(); // update to actual start time

    await callLog.save();

    res.status(200).json({ message: "Call accepted" });
  } catch (error) {
    console.error("Error accepting call:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc End the call, update end time and duration
 */
export const endCall = async (req, res) => {
  const { callLogId } = req.body;

  try {
    const callLog = await CallLog.findById(callLogId);
    if (!callLog) {
      return res.status(404).json({ message: "Call log not found" });
    }

    const callEndTime = new Date();
    const duration = Math.round(
      (callEndTime - new Date(callLog.callStartTime)) / 1000
    ); // in seconds

    callLog.callEndTime = callEndTime;
    callLog.duration = duration;

    await callLog.save();

    res.status(200).json({ message: "Call ended", duration });
  } catch (error) {
    console.error("Error ending call:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Mark a call as missed or cancelled
 */
export const updateCallStatus = async (req, res) => {
  const { callLogId, status } = req.body; // status = "missed" or "cancelled"

  try {
    const callLog = await CallLog.findById(callLogId);
    if (!callLog) {
      return res.status(404).json({ message: "Call log not found" });
    }

    callLog.callStatus = status;
    callLog.callEndTime = new Date();
    callLog.duration = 0;

    await callLog.save();

    res.status(200).json({ message: `Call marked as ${status}` });
  } catch (error) {
    console.error("Error updating call status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
