import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderID: { type: String, required: true }, // ID of the user who sent the message
    member: { type: String, required: true }, // ID of the recipient user
    time: { type: String, required: true }, // The time the message was sent
    chatRoomID: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true }, // Reference to the ChatRoom
    message: { type: String, required: true }, // The actual message content
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;

