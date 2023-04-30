const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    id: {
        type: String,
        require: true
    },
    numberOfCheckin: {
        type: Number
    },
    dateOfCheckin: {
        type: [Date]
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;
