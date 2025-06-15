const express = require("express");
const profileRouter = express.Router();
const {UserAuth} = require("../Middleware/auth");
const {validateProfileEdit} = require("../utils/validation")



profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send("something went wrong " + error.message);
  }
});


profileRouter.patch("/profile/edit",UserAuth, async(req,res)=>{
    try {
       validateProfileEdit(req) 
const {age,gender,photoUrl,skills} = req.body;
const logedInUser = req.user

Object.keys(req.body).forEach((key)=>(logedInUser[key] = req.body[key]) )
await logedInUser.save();
res.send(`${logedInUser.firstName}, your profile updated sucessfully`)

    } catch (error) {
        res.status(404).send("something went wrong " + error.message);
    }


})

module.exports = profileRouter;