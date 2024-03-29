const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const constants = require("./constants");

const { CONNECTION_STRING, API_KEY_COIN_MARKET_CAP, API_KEY_RAPID_API } =
  constants;

const server = express();

server.use(cors());
server.use(bodyParser.json());
server.use("/advertisments", express.static("advertisments"));

const UserSchema = require("./models/channel");

mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(8080, () => {
  console.log("Server has started");
});

// signup API
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
    user.password = null;
    res.status(200).send({ message: "Logged in successfully!", user });
    return true;
  }
  res.status(404).send({ message: "Invalid Email or Password" });
  return false;
  //user doesn't exist
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "advertisments/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

server.post("/uploadAdvertisment", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).send({ message: "Advertisment upload failed" });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).send({ message: "Advertisment upload failed" });
    }
    res.status(200).send({ message: "Advertisment uploaded successfully!" });
    // Everything went fine.
  });
});

server.get("/getAdvertisments", (req, res) => {
  const imagesFolder = path.join(__dirname, "advertisments");

  fs.readdir(imagesFolder, (err, files) => {
    if (err) {
      console.error("Error reading images folder:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png"].includes(extension);
    });

    const images = imageFiles.map((file) => {
      const imageUrl = `/advertisments/${file}`;

      return imageUrl;
    });

    res.json(images);
  });
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
            "X-CMC_PRO_API_KEY": API_KEY_COIN_MARKET_CAP,
          },
          params: {
            symbol: "BTC,SOL,DOGE,DOT,BNB,SHIB,MATIC",
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
            "X-RapidAPI-Key": API_KEY_RAPID_API,
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

server.get("/football", async (req, res) => {
  new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: "GET",
        url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
        params: { next: "50" },
        headers: {
          "X-RapidAPI-Key": API_KEY_RAPID_API,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error(error);
    }
  });
});
