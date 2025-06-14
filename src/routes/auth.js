const express = require("express")
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

const authRouter =express.Router();

// sign up api to create user with user data and save in db
authRouter.post("/signup", async (req, res) => {
  try {
    // validation the data
    validateSignUpData(req);
    // password encription
    const { password, firstName, lastName, emailId } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); // genrathe passwaord with hash

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("user added sucessfully");
  } catch (error) {
    res.status(400).send("Error saving the user " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credencial");
    }
    //validating user enterd password ref- user schema
    const isValidPassword = await user.validateUserPassword(password);

    if (isValidPassword) {
      // creating jwt token ref- user schema
      const webToken = await user.getJWT(); // expiring the jwt token check schema

      res.cookie("token", webToken, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); // expiring the cookie
      res.send("Login Sucessfull");
    } else {
      throw new Error("Invalid credencial 2");
    }
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

module.exports = authRouter;
