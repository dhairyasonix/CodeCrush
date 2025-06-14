const express = require("express");
const profileRouter = express.Router();
const {UserAuth} = require("../Middleware/auth")


profileRouter.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

module.exports = profileRouter;