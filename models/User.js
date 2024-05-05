const mongoose = require("mongoose");
const { friendRequest } = require("../controllers/profileControls");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tId: {
    type: String,
    required: true,
    unique: true,
  },
  resetToken: {
    type: String,
  },
  categories: {
    type: [String],
    default: [],
    required: true,
  },
  friends: {
    type: [String],
    default: [],
    required: true,
  },
  friendRequests: {
    type: [String],
    default: [],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
