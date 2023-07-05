require("dotenv").config();

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const API_KEY_COIN_MARKET_CAP = process.env.API_KEY_COIN_MARKET_CAP;
const API_KEY_RAPID_API = process.env.API_KEY_RAPID_API;

module.exports = {
  CONNECTION_STRING,
  API_KEY_COIN_MARKET_CAP,
  API_KEY_RAPID_API,
};
