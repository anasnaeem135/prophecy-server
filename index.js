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

server.post("/demo", async (req, res) => {
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

    res.json("Signed up successfully.");
  } catch (error) {
    res.json("Error");
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
    res.status(200).send({ message: "Logged in successfully" });
    return true;
  } else {
    //user doesn't exist
    res.status(400).send({ message: "Invalid Email or Password" });
  }
});

//

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
          symbol: "BTC,ETH",
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
    console.log(json.data.ETH[0].quote.USD.price);
    resolve(json);
  }
});
