const { MongoClient, Double } = require("mongodb");
const mongoose = require("mongoose");

// Replace the following with your Atlas connection string
const url =
  "mongodb+srv://anas:forbidden@prophecy.lmsu61v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected correctly to server");
    const userSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String,
      phoneNo: Double,
    });

    const User = mongoose.model("User", userSchema);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
