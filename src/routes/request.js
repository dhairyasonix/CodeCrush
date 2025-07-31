const express = require("express");
const requestRouter = express.Router();
const { UserAuth } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userID",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userID;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type :" + status });
      }
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!!" });
      }
      // check weather connexiton request alredy exist
      const exixtingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (exixtingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request alredy exist" });
      }
      //Making a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({ message: "Connection request marked as " + status, data });
    } catch (error) {
      res.status(400).send("Something went wrong " + error.message);
    }
  }
);
requestRouter.post("/request/review/:status/:requestId",
  UserAuth,
  async(req,res)=>{
try {
  const loggedInUser = req.user;
  const{status,requestId} = req.params
const allowedStatus = ["accepted", "rejected"]

if(!allowedStatus.includes(status)){
 return res.status(400).json({message:"Status not allowed!!"})
}

const connectionRequest = await ConnectionRequest.findOne({
  _id: requestId,
  toUserId: loggedInUser._id,
  status: "interested"
})

if(!connectionRequest){
 return res.status(400).json({message:"Connection request not found!!"})
}

connectionRequest.status = status;
const data = await connectionRequest.save()
res.status(200).json({message:"C0nnection request " + status, data})
  
} catch (error) {
  res.status(400).send("Something went wrong " + error.message);
}
})

module.exports = requestRouter;
