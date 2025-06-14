const express = require("express");
const requestRouter = express.Router();
const {UserAuth} = require("../Middleware/auth")

requestRouter.post("/sendConnectionRequest", UserAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent the connection request");
});

module.exports = requestRouter;