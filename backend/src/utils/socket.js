const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const { SAFE_USER_DATA } = require("../constants/userConstants");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_A_$#12_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  //created a middleware for token verification
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select(SAFE_USER_DATA);
      if (!user) return next(new Error("User not found"));

      socket.user = user; // store user info 
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.firstName}`);

    // Join chat
    socket.on("joinChat", ({ targetUserId }) => {
      const roomId = getSecretRoomId(socket.user._id.toString(), targetUserId);
      // console.log(`${socket.user.firstName} joined room: ${roomId}`);
      socket.join(roomId);
    });

    // Send message
    socket.on("sendMessage", ({ targetUserId, text }) => {
      const roomId = getSecretRoomId(socket.user._id.toString(), targetUserId);
      // console.log(`${socket.user.firstName}: ${text}`);
      io.to(roomId).emit("messageReceived", {
        firstName: socket.user.firstName,
        text,
      });
    });

    socket.on("disconnect", () => {
      // console.log(`User disconnected: ${socket.user.firstName}`);
    });
  });
};

module.exports = initializeSocket;
