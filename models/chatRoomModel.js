const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  participants: {
    memberA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the userModel
      required: true,
    },
    memberB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the userModel
      required: true,
    },
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Message", // Reference to the messageModel
    default: [],
  },
},
{ timestamps: true }
);


const ChatRoomModel = mongoose.model("ChatRoom", ChatRoomSchema);

module.exports = ChatRoomModel;
