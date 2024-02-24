const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const RandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let randString = "";
  while (randString.length < length) {
    randString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return randString;
};

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ success: false, error: "Fill all details." });
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ success: false, error: "Invalid email" });
  }

  let user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ success: false, error: "Email already in use" });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  let tId;
  do {
    tId = RandomString(15);
    user = await User.findOne({ tId });
  } while (user);
  // console.log(tId);

  user = null;

  try {
    user = await User.create({ username, email, password: hash, tId });
    const token = createToken(user._id);
    res.status(201).json({ success: true, token, username });
  } catch (err) {
    if (user) {
      User.findByIdAndDelete(user._id);
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: "Fill all details." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, error: "Invalid email" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ success: false, error: "Invalid password" });
  }

  const token = createToken(user._id);
  res.status(200).json({ success: true, token, username: user.username });
};
