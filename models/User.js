const mongoose = require("mongoose");

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
  categories: {
    type: [String],
    default: [],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
