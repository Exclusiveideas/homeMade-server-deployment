import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    participants: {
      memberA: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      memberB: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    messages: [
      {
        senderID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: String,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;

