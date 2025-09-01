const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const { SAFE_USER_DATA } = require("../constants/userConstants");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

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
    socket.on("joinChat", async ({ targetUserId }) => {
      try {
        console.log(socket.user._id ,"ids",targetUserId )
        // Check if there is an accepted connection between the two users
        const existingConnection = await ConnectionRequest.findOne({
          $or: [
            {
              fromUserId: socket.user._id,
              toUserId: targetUserId,
              status: "accepted",
            },
            {
              fromUserId: targetUserId,
              toUserId: socket.user._id,
              status: "accepted",
            },
          ],
        });
      

        if (!existingConnection) {
          // If no connection exists, send error back to client
          socket.emit("errorMessage", {
            message: "You are not connected with this user.",
          });
          return;
        }

        let chat = await Chat.findOne({
          participants: { $all: [socket.user._id, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [socket.user._id, targetUserId],
            messages: [],
          });
          await chat.save();
        }
        

        // Generate a unique room ID and join the room
        const roomId = getSecretRoomId(
          socket.user._id.toString(),
          targetUserId.toString()
        );
        socket.join(roomId);

        // Optional: Notify the user of successful join
        socket.emit("joinedChat", {
          roomId,
          message: "Successfully joined the chat room.",
        });
      } catch (error) {
        console.error("Error in joinChat:", error);
        socket.emit("errorMessage", {
          message: "An error occurred while joining the chat.",
        });
      }
    });

    // Send message
    socket.on("sendMessage", async ({ targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(
          socket.user._id.toString(),
          targetUserId
        );
        // console.log(`${socket.user.firstName}: ${text}`);
        // save message to db

        let chat = await Chat.findOne({
          participants: { $all: [socket.user._id, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [socket.user._id, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({ senderId: socket.user._id, text });
        await chat.save();
        io.to(roomId).emit("messageReceived", {
          firstName: socket.user.firstName,
          lastName: socket.user.lastName,
          text,
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      // console.log(`User disconnected: ${socket.user.firstName}`);
    });
  });
};

module.exports = initializeSocket;
