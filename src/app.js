const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();

app.use(express.json());

// sign up api to create user with user data and save in db
app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save();
        res.send("user added sucessfully")

    } catch (error) {
        res.status(400).send("Error saving the user " + error.message)
    }
})

// to find one by matching email id
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId

    try {
        const user = await User.findOne({ emailId: userEmail })
        res.send(user)
    } catch (error) {
        res.status(404).send("something went wrong", error.message)
    }
})
//delete by user id
app.delete("/user",async(req,res)=>{
 const id= req.body.userId
 try {
    await User.findByIdAndDelete(id)
    res.send("user deleted sucessfully")
 } catch (error) {
    res.status(404).send("something went wrong", error.message)
 }
});


// update by user id
app.patch("/user",async(req,res,next)=>{
const id = req.body.userId
if(!id){return next()}
const data = req.body

try {
  await  User.findByIdAndUpdate(id,data,{
runValidators: true,

  })
    res.send("sucessfully updated")
} catch (error) {
    res.status(404).send("something went wrong " + error.message)
}

})
app.patch("/user",async(req,res,next)=>{
const emailId = req.body.emailId

const data = req.body

try {
  await  User.updateMany({emailId: emailId},data)
    res.send("sucessfully updated")
} catch (error) {
    res.status(404).send("something went wrong", error.message)
}

})


// get data by user id
app.get("/userid", async (req, res) => {
    const id = req.body.id

    try {
        const user = await User.findById(id)
        res.send(user)

    } catch (error) {
        res.status(404).send("something went wrong", error.message)
    }

})


// Feed api to get all users
app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.status(404).send("something went wrong", error.message)
    }

})

connectDB().then(() => {

    console.log("Database connection establish..")
    app.listen(7777, () => {
        console.log("listning to 7777")
    })
}).catch((err) => {
    console.error("Database cannot be connected")
})



