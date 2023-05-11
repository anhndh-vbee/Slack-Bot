const { WebClient } = require("@slack/web-api");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");
const authController = require("./authController");

const client = new WebClient(config.SLACK_TOKEN);

const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const saveUser = await newUser.save();
    return res.status(200).json(saveUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

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

const showListUsers = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
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
      return res.send("User existed");
    }
    const newUser = new User({
      id: userInfo?.user.id,
      team_id: userInfo?.user.team_id,
      name: userInfo?.user.real_name,
      isAdmin: userInfo?.user.isAdmin,
      email: userInfo?.user?.profile.email,
    });
    const saveUser = await newUser.save();
    return res.status(200).json(saveUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// v1
const generateUrl = (id) => {
  const baseUrl = config.BASE_URL;
  const path = "/users-checkin";
  const query = { userId: id };

  const urlObj = new URL(path, baseUrl);
  Object.keys(query).forEach((key) =>
    urlObj.searchParams.append(key, query[key])
  );
  const userUrl = urlObj.toString();
  return userUrl;
};

const checkIn = async (req, res) => {
  const { user_id } = req.body;
  try {
    const userInfo = await checkUserInfo(user_id);
    const urlUser = generateUrl(userInfo?.user.id);
    return res.send(urlUser);
  } catch (error) {
    console.log(error);
  }
};

const postCheckIn = async (req, res) => {
  try {
    const id = req.query.userId;
    const user = await User.findOne({ id: id });

    const date = new Date();
    let check = true;

    if (
      authController.checkIPv2(req, res) !== config.IP ||
      authController.checkTimeCheckIn(date) === false
    ) {
      check = false;
      return res.status(200).send("Checkin failed");
    }

    if (date.getDay() === 5) {
      user.numberOfCheckin = 0;
      user.dateOfCheckin = [];
    }

    user.dateOfCheckin.forEach((dateCheckIn) => {
      if (date.getDay() === dateCheckIn.getDay()) {
        check = false;
        return res.status(200).send("You have checked in this day");
      }
    });

    if (check === true) {
      user.numberOfCheckin += 1;
      user.dateOfCheckin.push(date);
      await user.save();

      return res.status(200).send("Checkin successfully");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

// v2
const generateUrlWithToken = (user) => {
  const token = jwt.sign({ data: user }, config.JWT_ACCESS_KEY, {
    expiresIn: 300,
  });
  const baseUrl = config.BASE_URL;
  return `${baseUrl}/users-checkinv2/${token}`;
};

const checkInV2 = async (req, res) => {
  try {
    const { user_id } = req.body;
    const userData = await User.findOne({ id: user_id });
    const url = generateUrlWithToken(userData);
    return res.status(200).send(url);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const postCheckInV2 = async (req, res) => {
  try {
    const token = req.params.token;
    if (token) {
      jwt.verify(token, config.JWT_ACCESS_KEY, async (err, userData) => {
        if (err) {
          return res.status(403).send("Token is invalid. Checkin failed");
        } else {
          const userId = userData?.data?.id;
          const user = await User.findOne({ id: userId });
          const date = new Date();
          let check = true;

          if (
            authController.checkIPv2(req, res) !== config.IP ||
            authController.checkTimeCheckIn(date) === false
          ) {
            // console.log(authController.checkIPv2(req, res));
            check = false;
            return res.status(200).send("Checkin failed");
          }

          if (date.getDay() === 5) {
            user.numberOfCheckin = 0;
            user.dateOfCheckin = [];
          }

          user.dateOfCheckin.forEach((dateCheckIn) => {
            if (date.getDay() === dateCheckIn.getDay()) {
              check = false;
              return res.status(200).send("You have checked in this day");
            }
          });

          if (check === true) {
            user.numberOfCheckin += 1;
            user.dateOfCheckin.push(date);
            await user.save();
            console.log(authController.checkIPv2(req, res));
            return res.status(200).send("Checkin successfully");
          }
        }
      });
    } else {
      return res.status(401).send("Not authenticated");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

// const schedule = async (req, res) => {
//   try {
//     const { user_id } = req.body;
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };

module.exports = {
  addUser,
  getUser,
  checkUserInfo,
  showListUsers,
  checkIn,
  saveUserFromSlack,
  postCheckIn,
  checkInV2,
  postCheckInV2,
  // schedule,
};
