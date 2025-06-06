# Node.js (MERN) Backend Setup

This repository contains a basic Node.js (Express) backend connected to MongoDB via Mongoose. The following steps walk you through setting up the application from scratch.

---

## 1. Prerequisites

* Node.js (v12+)
* npm (comes with Node.js)
* Git (for version control)
* MongoDB Atlas account (or a local MongoDB instance)
* (Optional) MongoDB Compass to visualize your database

---

## 2. Initialize Git

1. Open a terminal in your project directory.
2. Run:

   ```bash
   git init
   ```
3. Create a `.gitignore` file and add:

   ```gitignore
   node_modules/
   .env
   ```

---

## 3. Install and Configure Express

1. Install Express:

   ```bash
   npm install express
   ```

2. Create a folder named `src` and inside it create `app.js`.

3. In `src/app.js`, add:

   ```js
   const express = require("express");
   const app = express();

   // Middleware to parse JSON bodies
   app.use(express.json());

   // Example route: GET /user
   app.get("/user", (req, res) => {
     try {
       res.send("This is user data");
     } catch (error) {
       res.status(404).send("Something went wrong: " + error.message);
     }
   });

   // Start the server on port 7777
   app.listen(7777, () => {
     console.log("Listening on port 7777");
   });
   ```

4. Save and exit.

---

## 4. Install and Configure Nodemon

Nodemon automatically restarts the server when files change.

1. Check if Nodemon is installed globally:

   ```bash
   nodemon --version
   ```

   * If installed, you’ll see a version number. Skip to step 3.
   * Otherwise, install globally:

     ```bash
     npm install -g nodemon
     ```

2. In `package.json`, add the following under `"scripts"`:

   ```jsonc
   "scripts": {
     "dev": "nodemon src/app.js",
     "start": "node src/app.js"
   }
   ```

3. To run the server in development mode (with auto-restart):

   ```bash
   npm run dev
   ```

4. To run the server normally:

   ```bash
   npm start
   ```

---

## 5. Set Up MongoDB Database

1. Log in to MongoDB Atlas ([https://www.mongodb.com](https://www.mongodb.com)).
2. Create a new cluster (free Shared Cluster is fine).
3. Click **Connect** → **Connect Your Application** and copy the connection string. It looks like:

   ```text
   mongodb+srv://<username>:<password>@<cluster-address>/myDatabase?retryWrites=true&w=majority
   ```
4. (Optional) Install MongoDB Compass and connect using the same string. If you see a connection error, go to **Network Access** in Atlas and whitelist your IP.

---

## 6. Install and Configure Mongoose

1. Install Mongoose:

   ```bash
   npm install mongoose
   ```

2. In `src`, create a folder named `config`. Inside `config`, create `database.js`.

3. In `src/config/database.js`, add:

   ```js
   const mongoose = require("mongoose");

   // Replace with your MongoDB connection string
   const MONGO_URI = process.env.MONGO_URI ||
     "mongodb+srv://<username>:<password>@<cluster-address>/myDatabase?retryWrites=true&w=majority";

   const connectDB = async () => {
     
       await mongoose.connect(MONGO_URI);
       
     } 
   };

   module.exports = connectDB;
   ```

4. In `src/app.js`, import and use `connectDB` before starting the server. Update the bottom of `app.js` to:

   ```js
   const connectDB = require("./config/database");

   // (Routes will be here...)

   // Connect to MongoDB, then start the server
   connectDB()
     .then(() => {
       app.listen(7777, () => {
         console.log("Server is listening on port 7777");
       });
     })
     .catch((err) => {
       console.error("Unable to connect to the database:", err.message);
     });
   ```

---

## 7. Create a Mongoose Schema

1. Inside `src`, create a folder named `models`. Inside `models`, create `user.js`.

2. In `src/models/user.js`, define the User schema:

   ```js
   const mongoose = require("mongoose");

   // Define user schema
   const userSchema = new mongoose.Schema({
     firstName: {
       type: String,
       required: true,
     },
     lastName: {
       type: String,
       required: true,
     },
     emailId: {
       type: String,
       required: true,
       unique: true,
     },
     password: {
       type: String,
       required: true,
     },
     age: {
       type: Number,
     },
     gender: {
       type: String,
     },
   });

   // Export the User model
   module.exports = mongoose.model("User", userSchema);
   ```

3. In `src/app.js`, import the User model:

   ```js
   const User = require("./models/user");
   ```

---

## 8. Basic CRUD Routes (User Example)

Replace the contents of `src/app.js` with the following to include CRUD routes:

```js
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json()); // Middleware to parse JSON

// --------------------------------------
// 1) SIGN UP: Create a new user in MongoDB
// --------------------------------------
app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send("Error saving the user: " + error.message);
  }
});

// -------------------------------------------------
// 2) GET USER BY EMAIL: Find one user by emailId
// -------------------------------------------------
app.get("/user", async (req, res) => {
  // You can also use req.query.emailId if you prefer query params
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// -------------------------------------------
// 3) DELETE USER: Delete by user ID (userId)
// -------------------------------------------
app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// --------------------------------------------------
// 4) UPDATE USER BY ID: Patch fields by userId
// --------------------------------------------------
app.patch("/user", async (req, res) => {
  const id = req.body.userId;
  const data = req.body;
  if (!id) {
    return res.status(400).send("userId is required for update");
  }
  try {
    const updated = await User.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// ---------------------------------------------------------
// 5) BULK UPDATE BY EMAIL: Update multiple users by email
// ---------------------------------------------------------
app.patch("/user/by-email", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;
  if (!emailId) {
    return res.status(400).send("emailId is required for bulk update");
  }
  try {
    const result = await User.updateMany({ emailId: emailId }, data);
    if (result.nModified === 0) {
      return res.status(404).send("No users were updated");
    }
    res.send(`${result.nModified} user(s) updated successfully`);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// --------------------------------------------------
// 6) GET USER BY ID: Find one user by _id (ID)
// --------------------------------------------------
app.get("/userid", async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// ----------------------------------------
// 7) GET ALL USERS: “Feed” endpoint
// ----------------------------------------
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Something went wrong: " + error.message);
  }
});

// -------------------------------------------------
// CONNECT TO DATABASE, THEN START THE EXPRESS SERVER
// -------------------------------------------------
connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err.message);
  });
```

---

## 9. Environment Variables (Recommended)

Instead of hardcoding sensitive information in the code, use a `.env` file.

1. Install `dotenv`:

   ```bash
   npm install dotenv
   ```

2. Create a file named `.env` in the project root and add:

   ```env
   MONGO_URI="mongodb+srv://<username>:<password>@<cluster-address>/myDatabase?retryWrites=true&w=majority"
   PORT=7777
   ```

3. In `src/config/database.js` and `src/app.js`, add at the top:

   ```js
   require('dotenv').config();
   ```

4. Use `process.env.MONGO_URI` and `process.env.PORT` instead of hardcoded values.

5. Add `.env` to `.gitignore`:

   ```gitignore
   .env
   ```

---

## 10. Folder Structure Overview

```text
my-mern-app/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── src/
    ├── app.js
    ├── config/
    │   └── database.js
    └── models/
        └── user.js
```

---

## 11. How to Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```
2. Start the server in development mode (auto-restart):

   ```bash
   npm run dev
   ```
3. Or start normally:

   ```bash
   npm start
   ```
4. The API will be available at `http://localhost:7777` (or the port specified in `.env`).

---

## 12. Testing the API

Use tools like Postman, Insomnia, or curl to test endpoints. Example with curl:

* **Sign Up**:

  ```bash
  curl -X POST http://localhost:7777/signup \
    -H "Content-Type: application/json" \
    -d '{ "firstName": "John", "lastName": "Doe", "emailId": "john@example.com", "password": "secure123" }'
  ```

* **Get User by Email** (using body):

  ```bash
  curl -X GET http://localhost:7777/user \
    -H "Content-Type: application/json" \
    -d '{ "emailId": "john@example.com" }'
  ```

* **Delete User by ID**:

  ```bash
  curl -X DELETE http://localhost:7777/user \
    -H "Content-Type: application/json" \
    -d '{ "userId": "<MongoDB ObjectId>" }'
  ```

* **Update User by ID**:

  ```bash
  curl -X PATCH http://localhost:7777/user \
    -H "Content-Type: application/json" \
    -d '{ "userId": "<MongoDB ObjectId>", "firstName": "Jane" }'
  ```

* **Get All Users**:

  ```bash
  curl -X GET http://localhost:7777/feed
  ```

---

## 13. Additional Tips

* Always validate request data before saving/updating in production.
* Use middleware for authentication (JWT, Passport, etc.) if needed.
* Add proper error-handling middleware at the bottom of `app.js`:

  ```js
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
  ```
* Modularize your routes by creating separate route files under `src/routes/` if the project grows.

---

## 14. License

This project is licensed under the MIT License.

---

© 2025 Your Name
