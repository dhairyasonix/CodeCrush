const express = require("express");
const { UserAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRoute = express.Router();
const SAFE_USER_DATA = "firstName LastName photoUrl age gender skills";
const User = require("../models/user")

userRoute.get("/user/requests/received", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

    res
      .status(200)
      .json({
        message: "Connection fetched sucessfully",
        data: connectionRequests,
      });
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
  }
});

userRoute.get("/user/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const filteredConnections = connections.map((connection) => {
      // If the logged-in user is the sender, show receiver's data
      if (connection.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return connection.toUserId;
      }
      // If the logged-in user is the receiver, show sender's data
      return connection.fromUserId;
    });

    res.status(200).json({ filteredConnections });
  } catch (error) {
    res.status(400).send("SOmething went wrong " + error.message);
  }
});

userRoute.get("/user/feed", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit>50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connectionRequest = await ConnectionRequest.find({       
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId toUserId");
const hideUser = new Set();

    connectionRequest.forEach((reqs) => {
      hideUser.add(reqs.fromUserId.toString());
      hideUser.add(reqs.toUserId.toString());
    });
 

    const users = await User.find({
        $and:[{ _id: {$nin: Array.from(hideUser)}},
              { _id: { $ne: loggedInUser._id }}] 
       
    }).select(SAFE_USER_DATA).skip(skip).limit(limit)

    res.status(200).json({ users });
  } catch (error) {}
});

module.exports = userRoute;
