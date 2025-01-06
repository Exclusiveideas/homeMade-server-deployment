import express from "express";
import { ChatRoomController } from "../controllers/chatroom.controller.js";

const router = express.Router();

// Routes for chat room
router.post("/", ChatRoomController.createChatRoom); // Create chat room
router.post("/sendMessage", ChatRoomController.sendMessage); // Send message
router.get("/:chatRoomID", ChatRoomController.getMessages); // Get messages for a chat room

export default router;

