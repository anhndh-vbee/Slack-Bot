const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (user) => {
    return jwt.sign({ data: user }, config.JWT_ACCESS_KEY, { expiresIn: 300 })
}

const checkUrl = () => {

}
