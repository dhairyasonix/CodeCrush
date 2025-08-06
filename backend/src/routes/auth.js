const express = require("express")
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const {SAFE_USER_DATA} =require("../constants/userConstants")

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
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      return  res.status(401).send("Invalid Credencials")
    }
    //validating user enterd password ref- user schema
    const isValidPassword = await user.validateUserPassword(password);

    if (isValidPassword) {
      // creating jwt token ref- user schema
      const webToken = await user.getJWT(); // expiring the jwt token check schema
const userObj = user.toObject();
// filtring data
const safeUser = SAFE_USER_DATA.split(" ").reduce((acc, field) => {
  if (userObj[field] !== undefined) acc[field] = userObj[field];
  return acc;
}, {});
      res.cookie("token", webToken, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); // expiring the cookie
      res.send(safeUser);
    } else {
       res.status(401).send("Invalid Credencials")
    }
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});

authRouter.post("/logout",(req,res)=>{

res.cookie("token",null,{expires: new Date(Date.now())})
res.send("Logout sucessfully")
})

module.exports = authRouter;
