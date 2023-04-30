const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async() => {
    try {
        await mongoose.connect(config.MONGODB_URL);
        console.log('Connect successfully');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
