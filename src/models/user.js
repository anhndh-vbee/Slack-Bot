const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    id: {
      type: String,
      require: true,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
    },
    days: {
      type: [Array],
      default: [[new Date()]],
    },
    schedules: {
      type: [
        {
          day: String,
          time: String,
        },
      ],
    },
    thread: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
