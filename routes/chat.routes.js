import express from "express";
import { createChatRoom, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

// Create a new chat room
router.post("/create", createChatRoom);

// Send a message
router.post("/send", sendMessage);

export default router;

