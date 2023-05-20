require('dotenv').config();

const config = {
  PORT: process.env.PORT,
  HOST_NAME: process.env.HOST_NAME,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  BASE_URL: process.env.BASE_URL,
  IP: process.env.IP,
  URL_EXPRIDE_TIME: 1000 * 5,
  EMAIL: process.env.EMAIL,
  PASS_EMAIL: process.env.PASS_EMAIL,
  ADMIN_ID: process.env.ADMIN_ID,
  CHANNEL_ID: process.env.CHANNEL_ID,
};
module.exports = config;
