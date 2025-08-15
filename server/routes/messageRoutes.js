import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
  sendMessage
} from "../controllers/messagecontroller.js";

const messageRouter = express.Router();

// Get all users except logged-in user
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Get messages with a specific user
messageRouter.get("/:id", protectRoute, getMessages);

// Mark messages as seen
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);

// Send a message to a user
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
