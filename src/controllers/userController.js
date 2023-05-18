const { WebClient } = require('@slack/web-api');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const authController = require('./authController');
const dateService = require('../services/dateService');
const userService = require('../services/user.service');
const { scheduleExcelResponse } = require('../excel-processing/schedule.excel');
const {
  timekeepingExcelResponse,
} = require('../excel-processing/timekeeping.excel');

const client = new WebClient(config.SLACK_TOKEN);

const checkUserInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfo = await client.users.info({ user: id });
      resolve(userInfo);
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserId = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await User.findOne({ id: userId }).exec();
      if (check === null || check === {}) {
        resolve(true);
      } else resolve(false);
    } catch (error) {
      reject(error);
    }
  });
};

const saveUserFromSlack = async (req, res) => {
  try {
    const { user_id } = req.body;
    const userInfo = await checkUserInfo(user_id);
    const check = await checkUserId(userInfo?.user?.id);
    if (!check) {
      return res.send('User existed');
    }
    const newUser = new User({
      id: userInfo?.user.id,
      team_id: userInfo?.user.team_id,
      name: userInfo?.user.real_name,
      role: userInfo?.user.is_admin === true ? 'Admin' : 'User',
      email: userInfo?.user?.profile.email,
    });
    const saveUser = await newUser.save();
    return res.status(200).json(saveUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const generateUrlWithToken = (user) => {
  const token = jwt.sign({ data: user }, config.JWT_ACCESS_KEY, {
    expiresIn: 300,
  });
  const baseUrl = config.BASE_URL;
  return `${baseUrl}/user-checkin/${token}`;
};

const checkIn = async (req, res) => {
  try {
    const { user_id } = req.body;
    const userData = await User.findOne({ id: user_id });
    const url = generateUrlWithToken(userData);
    return res.status(200).send(url);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postCheckIn = async (req, res) => {
  try {
    const token = req.params.token;
    if (token) {
      jwt.verify(token, config.JWT_ACCESS_KEY, async (err, userData) => {
        if (err) {
          return res.status(403).send('Token is invalid. Checkin failed');
        } else {
          const userId = userData?.data?.id;
          const user = await User.findOne({ id: userId });
          const date = new Date();
          let check = true;
          // console.log(authController.checkIPv2(req, res));
          if (authController.checkIPv2(req, res) !== config.IP) {
            check = false;
            return res.status(200).send('Checkin failed');
          }

          if (check === true) {
            let listCheckInTime = [];
            listCheckInTime = user.days;
            let found = false;
            listCheckInTime.forEach((day) => {
              if (
                day[0].getDay() === date.getDay() &&
                day[0].getMonth() === date.getMonth() &&
                day[0].getFullYear() === date.getFullYear()
              ) {
                day.push(date);
                found = true;
              }
            });

            if (!found) {
              listCheckInTime.push([date]);
            }

            user.days = listCheckInTime;
            user.markModified('days');
            await user.save();
            let informCheckin = user.days;
            const len = informCheckin.length;
            let dayCheckinOfMonth = informCheckin.filter(
              (day) =>
                dateService.getWeek(day[0]) ===
                dateService.getWeek(informCheckin[len - 1][0]),
            );

            let contentCheckinThisMonth = `
              <h3>List check in this month</h3>
            `;

            dayCheckinOfMonth.forEach((day) => {
              const timeCheckin = day[0];
              const indexTimeCheckout = day.length - 1;

              contentCheckinThisMonth += `
              <br/>
              <tr>
                <td>${timeCheckin.getDate()}-${
                timeCheckin.getMonth() + 1
              }-${timeCheckin.getFullYear()}</td>
                <td>${timeCheckin.getHours()}:${timeCheckin.getMinutes()}:${timeCheckin.getSeconds()}</td>
                <td>${day[indexTimeCheckout].getHours()}:${day[
                indexTimeCheckout
              ].getMinutes()}:${day[indexTimeCheckout].getSeconds()}</td>
              </tr>
              <br/>
              `;
            });

            return res
              .status(200)
              .send(`Check in successfully\n ${contentCheckinThisMonth}`);

            // return res
            //   .status(200)
            //   .send(`Check in successfully\n ${JSON.stringify(showInform)}`);
          }
        }
      });
    } else {
      return res.status(401).send('Not authenticated');
    }
  } catch (error) {
    return res.status(200).json(error);
  }
};

const schedule = async (req, res) => {
  try {
    const { user_id, text } = req.body;
    const user = await User.findOne({ id: user_id });
    const listDay = text.split(' ');
    let scheduleDay = [];
    listDay.forEach((day) => {
      scheduleDay.push({
        day: dateService.getDayOfWeek(day[0]),
        time:
          day[1].toLowerCase() === 's'
            ? 'Morning'
            : day[1].toLowerCase() === 'c'
            ? 'Afternoon'
            : 'Full',
      });
    });
    user.schedules = scheduleDay;
    await user.save();
    return res.send('Register successfully');
  } catch (error) {
    return res.status(500).json(error);
  }
};

const index = async (req, res) => {
  const condition = req.query;
  const users = await userService.findUser(condition);
  const resData = await scheduleExcelResponse(req, res, users.users.data);
  res.status(200).send(resData);
};

const infoPerMonth = async (req, res) => {
  const condition = req.query;
  const { month, year } = req.body;
  const usersInfoInMonth = await userService.findUsersInfoPerMonth(
    month,
    year,
    condition,
  );
  const resData = await timekeepingExcelResponse(
    req,
    res,
    usersInfoInMonth.users.data,
  );
  res.status(200).send(resData);
};

const destroy = async (req, res) => {
  const { userId } = req.params;
  const user = await userService.destroyUser(userId);
  res.status(200).send(user);
};

module.exports = {
  checkUserInfo,
  saveUserFromSlack,
  checkIn,
  schedule,
  postCheckIn,
  index,
  infoPerMonth,
  destroy,
};
