const axios = require('axios');
const { WebClient, LogLevel } = require('@slack/web-api');
const User = require('../models/user');

const addUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const saveUser = await newUser.save();
        return res.status(200).json(saveUser);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.find({ id: req.query.userId })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error);
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updateUser = await User.findOneAndUpdate({ id: id }, req.body, { new: true });
        return res.status(200).json(updateUser);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// const showUrlUser = async () => {
//     try {
//         const url = 'https://slack.com/api/chat.postMessage';
//         await axios.post(url, {
//             channel: '#test',
//             text: 'Hello xinn'
//         }, { headers: { authorization: `Bearer xoxb-5169176286966-5169860134630-w3ZhbzoML1W1CNKs3teGooXu` } })
//         // await showListUsers();
//         await checkUserInfo();
//     } catch (error) {
//         console.log(error);
//     }
// }

const client = new WebClient('xoxb-5169176286966-5169860134630-3lONlrX9oL4qPWb5Zv3yKuvm', {
    logLevel: LogLevel.DEBUG
})

// const userId = 'U054ZRA3YJJ';

const checkUserInfo = async (req, res) => {
    const { user_id, text } = req.body;
    try {
        const userInfo = await client.users.info({ user: user_id });
        console.log(userInfo);
        res.send(`Hello ${userInfo?.user.real_name}`)
    } catch (error) {
        console.log('error:', error);
    }
}

const showListUsers = async (req, res) => {
    // try {
    //     const response = await client.users.list()
    //     const users = response.members;
    //     // console.log(`have ${users.length} users in channel`);
    //     users.forEach(user => console.log(user));
    // } catch (error) {
    //     console.log(error);
    // }

    try {
        const result = await client.usergroups.list({ include_users: true });
        console.log(result);
        res.send('list')
    } catch (error) {
        console.error(error);
    }
}

const generateUrl = (id) => {
    const baseUrl = 'https://9ca2-2001-ee0-49e7-f600-d199-650b-af2c-f6f5.ngrok-free.app';
    const path = '/users';
    const query = { userId: id };

    const urlObj = new URL(path, baseUrl);
    Object.keys(query).forEach(key => urlObj.searchParams.append(key, query[key]));

    const userUrl = urlObj.toString();

    return userUrl
}

const checkIn = async (req, res) => {
    const { user_id } = req.body;
    try {
        const userInfo = await client.users.info({ user: user_id });
        const urlUser = generateUrl(userInfo?.user.id)
        res.send(urlUser)
    } catch (error) {
        console.log(error);
    }
}

// const postCheckIn = async (req, res) => {
//     try {
//         console.log(req.body);
//     } catch (error) {
//         console.log(error);
//     }
// }

module.exports = { addUser, getUser, updateUser, checkUserInfo, showListUsers, checkIn };
