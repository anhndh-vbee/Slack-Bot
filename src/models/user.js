const mongoose = require("mongoose");

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
    team_id: {
      type: String,
      require: true,
    },
    email: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
    },
    numberOfCheckin: {
      type: Number,
      default: 0,
    },
    dateOfCheckin: {
      type: [Date],
    },
    schedules: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
