// const express = require("express");
// const mongoose = require("mongoose");

// const { MongoClient, Double } = require("mongodb");

// // Replace the following with your Atlas connection string
// const url =
//   "mongodb+srv://anas:forbidden@prophecy.lmsu61v.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(url);

// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected correctly to server");
//   } catch (err) {
//     console.log(err.stack);
//   } finally {
//     await client.close();
//   }
// }

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   password: String,
//   phoneNo: Number,
// });
// const User = mongoose.model("User", userSchema);

// run().catch(console.dir);

// server.post("/demo", async (req, res) => {
//   let user = new User();
//   user.username = req.body.username;
//   user.password = req.body.password;

//   const doc = await user.save();
//   console.log(doc);

//   console.log(req.body);
//   res.json(doc);
// });

// server.listen(8080, () => {
//   console.log("Server has started");
// });

const express = require("express");
const mongoose = require("mongoose");
const UserSchema = require("./models/channel");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
server.use(cors());
server.use(bodyParser.json());

const DB =
  "mongodb+srv://anas:forbidden@prophecy.lmsu61v.mongodb.net/Prophecy?retryWrites=true&w=majority";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(8080, () => {
  console.log("Server has started");
});

server.post("/demo", (req, res) => {
  console.log("Request : ", req.body);

  var userSchema = new UserSchema();
  userSchema.firstName = "Anas";
  userSchema.lastName = "Naeem";
  userSchema.phoneNo = 03244701702;
  userSchema.email = "anasnaeem135@gmail.com";
  userSchema.password = "12345";

  try {
    userSchema.save();
  } catch (error) {
    console.log("Hellp");
  }
});
