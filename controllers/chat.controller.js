import ChatRoom from "../models/chatRoom.model.js";
import User from "../models/user.models.js";
import Message from "../models/message.model.js";

// Create a new chat room
export const createChatRoom = async (req, res) => {
  try {
    const { memberA, memberB } = req.body;

    // Check if both users exist
    const userA = await User.findById(memberA);
    const userB = await User.findById(memberB);

    if (!userA || !userB) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Create a new chat room
    const newChatRoom = new ChatRoom({
      participants: { memberA, memberB },
    });

    await newChatRoom.save();

    // Add chat room references to users
    userA.chats.push(newChatRoom._id);
    userB.chats.push(newChatRoom._id);

    await userA.save();
    await userB.save();

    res.status(201).json(newChatRoom);
  } catch (error) {
    console.log("Error in creating chat room", error);
    res.status(500).json({ message: "Error creating chat room" });
  }
};

// Send a message in a chat room
export const sendMessage = async (req, res) => {
  try {
    const { senderID, member, time, chatRoomID, message } = req.body;

    // Check if the chat room exists
    const chatRoom = await ChatRoom.findById(chatRoomID);
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Create a new message
    const newMessage = new Message({
      senderID,
      member,
      time,
      chatRoomID,
      message,
    });

    await newMessage.save();

    // Add the message to the chat room
    chatRoom.messages.push(newMessage._id);
    await chatRoom.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sending message", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

