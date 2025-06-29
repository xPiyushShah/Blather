import Message from "../Models/message.model.js";
import User from "../Models/user.model.js";

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
    // console.log("from helper ", message);
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

export const onceUser = async ( id ) => {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (error) {
    console.error("Error saving message:", error);
  }
  return ;
};
