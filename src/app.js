const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("./utils/validation")

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
            res.send("Login Sucessfull")
        }
        else {
            throw new Error("Invalid credencial")
        }

    } catch (error) {
        res.status(404).send("something went wrong " + error.message)
    }

})

// to find one by matching email id
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId

    try {
        const user = await User.findOne({ emailId: userEmail })
        res.send(user)
    } catch (error) {
        res.status(404).send("something went wrong " + error.message)
    }
})
//delete by user id
app.delete("/user", async (req, res) => {
    const id = req.body.userId
    try {
        await User.findByIdAndDelete(id)
        res.send("user deleted sucessfully")
    } catch (error) {
        res.status(404).send("something went wrong", error.message)
    }
});


// update by user id
app.patch("/user/:userId", async (req, res, next) => {
    const id = req.params?.userId

    const data = req.body

    try {
        const allowedUpdate = ["skills", "photoUrl", "gender", "age", "about"]
        const updateAloowed = Object.keys(data).every((k) => allowedUpdate.includes(k))
        if (!updateAloowed) {
            throw new Error("Update contains invalid fields")
        }


        await User.findByIdAndUpdate(id, data, {
            runValidators: true,

        })
        res.send("sucessfully updated")
    } catch (error) {
        res.status(404).send("something went wrong " + error.message)
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



