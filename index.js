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

server.post("/demo", async (req, res) => {
  const { body } = req;
  console.log("Request : ", body);

  const { firstName, lastName, email, phoneNo, password } = body;

  const check = await UserSchema.isThisEmailInUse(email);

  if (check) {
    var userSchema = new UserSchema();
    userSchema.firstName = firstName;
    userSchema.lastName = lastName;
    userSchema.phoneNo = phoneNo;
    userSchema.email = email;
    userSchema.password = password;
  }

  try {
    userSchema.save();
  } catch (error) {
    console.log("Hellp");
  }
});

// login API

server.post("/login", async (req, res) => {
  const { body } = req;

  console.log(body);

  const { email, password } = body;

  const check = await UserSchema.findOne({
    email: email,
    password: password,
  });

  console.log(check);
});
