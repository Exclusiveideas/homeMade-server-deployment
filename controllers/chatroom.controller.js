import ChatRoom from "../models/chatroom.model.js";

// Controller for ChatRoom
export const ChatRoomController = {
  // Create a new chat room
  createChatRoom: async (req, res) => {
    try {
      const { memberA, memberB } = req.body;

      const newChatRoom = new ChatRoom({
        participants: { memberA, memberB },
        messages: [],
      });

      const savedChatRoom = await newChatRoom.save();
      res.status(201).json({
        message: "Chat room created successfully",
        chatRoom: savedChatRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating chat room", error: error.message });
    }
  },

  // Send a message in a chat room
  sendMessage: async (req, res) => {
    try {
      const { chatRoomID, senderID, member, time, message } = req.body;

      const newMessage = {
        senderID,
        member,
        time,
        chatRoomID,
      };

      const chatRoom = await ChatRoom.findByIdAndUpdate(
        chatRoomID,
        { $push: { messages: newMessage } },
        { new: true }
      );

      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }

      res.status(200).json({ message: "Message sent successfully", chatRoom });
    } catch (error) {
      res.status(500).json({ message: "Error sending message", error: error.message });
    }
  },

  // Get messages from a chat room
  getMessages: async (req, res) => {
    try {
      const { chatRoomID } = req.params;
      const chatRoom = await ChatRoom.findById(chatRoomID).populate("messages.senderID");

      if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
      }

      res.status(200).json(chatRoom.messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
  },
};

