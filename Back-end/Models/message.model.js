// import mongoose from "mongoose";

// const message = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   seenAt: {
//     type: String,
//     default: false,
//   },
//   image: {
//     type: String,
//     default: null,
//   },
//   audio: {
//     type: String,
//     default: null,
//   },
//   video: {
//     type: String,
//     default: null,
//   },
//   text: {
//     type: String,
//   },
// },{timestamps: true});
// const Message = mongoose.model("Message", message);
// export default Message;


import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
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

    text: {
      type: String,
      default: "",
    },

    file: {
      type: String,
      default: null,
    },

    mediaType: {
      type: String,
      enum: [
        "image",
        "video",
        "audio",
        "pdf",
        "file",
        null,
      ],
      default: null,
    },

    seen: {
      type: Boolean,
      default: false,
    },

    seenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;