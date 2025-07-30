const express = require("express");
const profileRouter = express.Router();
const { UserAuth } = require("../Middleware/auth");
const { validateProfileEdit } = require("../utils/validation");
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcrypt")

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

profileRouter.patch("/profile/edit", UserAuth, async (req, res) => {
  try {
    validateProfileEdit(req);
    const logedInUser = req.user;
    console.log(logedInUser);
    Object.keys(req.body).forEach((key) => (logedInUser[key] = req.body[key]));
    await logedInUser.save();
    res.json({
      message: `${logedInUser.firstName}, your profile updated sucessfully`,
      data: logedInUser,
    });
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

profileRouter.patch("/profile/password", async (req, res) => {
  try {
    const { emailId, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });
   
    if (!user) {
      throw new Error("Invalid credencial");
    } else if (!validator.isStrongPassword(newPassword)) {
      throw new Error("password is not strong");
    }

    //validating user enterd password ref- user schema
    const isValidPassword = await user.validateUserPassword(oldPassword);
    console.log(isValidPassword)
    if (isValidPassword) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      user.save();
      res.send("Password updated sucessfully");
    } else {
      throw new Error("Invalid credencial");
    }
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

module.exports = profileRouter;
