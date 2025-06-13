const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {UserAuth} = require("./Middleware/auth")

app.use(cookieparser())
app.use(express.json());

// sign up api to create user with user data and save in db
app.post("/signup", async (req, res) => {
    try {// validation the data 
        validateSignUpData(req)
        // password encription 
        const { password, firstName, lastName, emailId, } = req.body

        const passwordHash = await bcrypt.hash(password, 10) // genrathe passwaord with hash

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await user.save();
        res.send("user added sucessfully")

    } catch (error) {
        res.status(400).send("Error saving the user " + error.message)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credencial")
        }
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (isValidPassword) {

            // creating jwt token
const webToken = await jwt.sign({_id:user._id}, "CodeCrush@Dhairy123",{ expiresIn: '1d' }) // expiring the jwt token

            res.cookie("token",webToken,{ expires: new Date(Date.now() + 8 * 3600000)}) // expiring the cookie
            res.send("Login Sucessfull")
        }
        else {
            throw new Error("Invalid credencial")
        }

    } catch (error) {
        res.status(404).send("something went wrong " + error.message)
    }

})

app.get("/profile",UserAuth,async(req,res)=>{
    try {   
        const user = req.user
        res.send(user);
}   catch (error) {
        res.status(404).send("something went wrong " + error.message)
}
})
// to find one by matching email id


app.post("/sendConnectionRequest",UserAuth,(req,res)=>{
const user = req.user
res.send(user.firstName + " sent the connection request")

})

connectDB().then(() => {

    console.log("Database connection establish..")
    app.listen(7777, () => {
        console.log("listning to 7777")
    })
}).catch((err) => {
    console.error("Database cannot be connected")
})



