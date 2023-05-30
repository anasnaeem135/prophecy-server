const express = require("express");
const mongoose = require("mongoose");
const UserSchema = require("./models/channel");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
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

server.post("/signup", async (req, res) => {
  const { body } = req;

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

    res.status(200).send({ message: "Signed up successfully!" });
    return true;
  } catch (error) {
    res.status(404).send({ message: "Signed up failed" });
    console.error(error);
  }
});

// login API

server.post("/login", async (req, res) => {
  const { body } = req;

  const { email, password } = body;

  const user = await UserSchema.findOne({
    email: email,
    password: password,
  });

  if (user) {
    //user exists
    res.status(200).send({ message: "Logged in successfully!" });
    return true;
  }
  res.status(404).send({ message: "Invalid Email or Password" });
  return false;
  //user doesn't exist
});

//
server.get("/crypto", async (req, res) => {
  let response = null;
  new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(
        " https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "8c778a4e-f1ae-42b9-abe0-efb9a870d00e",
          },
          params: {
            symbol: "BTC,SOL,DOGE,DOT",
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      // console.log(json.data.BTC[0].quote.USD.price);
      // console.log(json.data);
      res.json(json.data);
      resolve(json);
    }
  });
});

server.get("/cricket", async (req, res) => {
  let response = null;
  new Promise(async (resolve, reject) => {
    try {
      response = await axios.get(
        "https://cricket-live-data.p.rapidapi.com/fixtures",
        {
          headers: {
            "X-RapidAPI-Key":
              "577412bbd5mshc7dc2a58368aa4ap180df4jsna48c9bc6659a",
            "X-RapidAPI-Host": "cricket-live-data.p.rapidapi.com",
          },
        }
      );
    } catch (ex) {
      response = null;
      // error
      console.log(ex);
      reject(ex);
    }
    if (response) {
      // success
      const json = response.data;
      res.json(json);
      resolve(json);
    }
  });
});
