const express = require("express");
const connectDB = require("./config/database");

const app = express();

const cookieparser = require("cookie-parser");

const { UserAuth } = require("./Middleware/auth");

app.use(cookieparser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRoute = require("./routes/user")

app.use("/",authRouter,profileRouter,requestRouter,userRoute)


// to find one by matching email id



connectDB()
  .then(() => {
    console.log("Database connection establish..");
    app.listen(7777, () => {
      console.log("listning to 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
