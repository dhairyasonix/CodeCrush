const express = require("express");
const { UserAuth } = require("../Middleware/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }) .populate({
        path: "participants",
        select: "firstName lastName photoUrl", 
      }).populate({
        path:"messages.senderId",
        select:"firstName lastName"
    })  ;
    if (!chat) {
      // TODO check connection exixt in db
   throw new error("Chat not found")
    }
    res.json(chat);
  } catch (error) {
    console.error(error);
  }
});

module.exports = chatRouter;
