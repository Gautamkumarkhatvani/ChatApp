import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server with proper CORS config
export const io = new Server(server, {
  cors: { origin: "*" },
});

// Store online users: { userId: socketId }
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit updated online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Connect to MongoDB and then start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    // Test route
    app.use("/api/status", (req, res) => res.send("Server is live"));

    app.use("/api/auth", userRouter);
    app.use("/api/messages", messageRouter);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () =>
      console.log(`Server is running on port: ${PORT}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();