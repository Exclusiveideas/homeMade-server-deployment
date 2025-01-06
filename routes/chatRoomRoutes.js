const router = require("express").Router();
const { ChatRoomModel } = require("../models");


// Create a Chatroom
router.post('/create', async (req, res) => {
    const { memberA, memberB } = req.body;

  if(!memberA || !memberB) {
    return res.status(400).json({ message: "Both members are required" });
  }
  
    try {
      // Check if a chatroom already exists between these two members
      let existingChatRoom = await ChatRoomModel.findOne({
        $or: [
          { "participants.memberA": memberA, "participants.memberB": memberB },
          { "participants.memberA": memberB, "participants.memberB": memberA }
        ]
      });
  
      if (existingChatRoom) {
        return res.status(200).json(existingChatRoom); // Return existing chatroom
      }
  
      // Create a new chatroom
      const newChatRoom = new ChatRoomModel({
        participants: { memberA, memberB },
        messages: [] // Initialize with an empty messages array
      });
  
      const savedChatRoom = await newChatRoom.save();
  
      res.status(201).json(savedChatRoom);
  
    } catch (err) {
      res.status(500).json({ message: "Error creating chatroom", error: err.message });
    }
  });
  


// Fetch Chatroom Details
router.get("/", async (req, res) => {
  const { chatRoomID } = req.query;

  if (!chatRoomID) {
    return res.status(400).json({ message: "chatRoom ID is required" });
  }

  try {
    const chatRoom = await ChatRoomModel.findById(chatRoomID).populate(
      "messages"
    );

    if (!chatRoom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    res.status(200).json(chatRoom);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching chatroom details", error: err.message });
  }
});
  


// Fetch User's Chatroom Details
router.get('/fetch', async (req, res) => {
  const { userID } = req.query;

  if(!userID) {
    return res.status(400).json({ message: "user ID is required" });
  }


  try {
    // Find all chatrooms where the user is a participant
    const chatRooms = await ChatRoomModel.find({
      $or: [
        { "participants.memberA": userID },
        { "participants.memberB": userID }
      ]
    })
      .populate({
        path: 'participants.memberA participants.memberB', // Populate both members
        select: 'name profilePic' // Select only the necessary fields
      })
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 } // Get the last message
      });

    // Format the response
    const response = chatRooms.map(chatRoom => {
      const isMemberA = chatRoom.participants.memberA._id.toString() === userID;
      const secondMember = isMemberA
        ? chatRoom.participants.memberB
        : chatRoom.participants.memberA;
      const lastMessage = chatRoom.messages[0] || null;

      return {
        _id: chatRoom._id,
        secondMember: {
          name: secondMember.name,
          image: secondMember.profilePic
        },
        lastMessage: lastMessage
          ? { message: lastMessage.message, timeCreated: lastMessage.time }
          : { message: 'Tap to message', timeCreated: '' }
      };
    });

    res.status(200).json(response);

  } catch (err) {
    res.status(500).json({ message: "Error fetching chatrooms", error: err.message });
  }
});



module.exports = router;