require('dotenv').config();

const config = {
  PORT: process.env.PORT,
  HOST_NAME: process.env.HOST_NAME,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  BASE_URL: process.env.BASE_URL,
  IP: process.env.IP,
};

module.exports = config;
