import Message from "../Models/message.model.js";

export const SendMessage = async ({
  senderId,
  receiverId,
  text,
  image,
  audio,
  video,
  time,
}) => {
  try {
    const message = new Message({
      senderId,
      receiverId,
      text,
      image,
      audio,
      video,
      updatedAt: time,
    });
    await message.save();
    console.log("from helper ", message);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};
