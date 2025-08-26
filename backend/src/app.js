const express = require("express");
const connectDB = require("./config/database");
const { createServer } = require('node:http');
const app = express();
const cors = require("cors");
const cookieparser = require("cookie-parser");
require('dotenv').config();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieparser());
app.use(express.json());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRoute = require("./routes/user");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter, profileRouter, requestRouter, userRoute,chatRouter);

const server = createServer(app);
initializeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connection establish..");
    server.listen(process.env.PORT, () => {
      console.log("listning to 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
