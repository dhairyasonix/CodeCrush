const { SAFE_USER_DATA } = require("../constants/userConstants");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const UserAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("Please Login!")
    }
    //validate the token
    const decodedValue = await jwt.verify(token, "CodeCrush@Dhairy123");
    const { _id } = decodedValue;

    const user = await User.findById(_id).select(SAFE_USER_DATA);
    if (!user) {
      throw new error("User not found please try again");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
};

module.exports = { UserAuth };
