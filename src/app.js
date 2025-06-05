const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();

app.post("/signup", async(req, res) => {
    const user = new User({
        firstName: "Dhairya",
        lastName: "Soni",
        emailId: "dhairya@soni.com",
        password: "dhairya123"
    })
try {
    await user.save();
    res.send("user added sucessfully")

} catch (error) {
    res.status(400).send("Error saving the user",error.message)
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



