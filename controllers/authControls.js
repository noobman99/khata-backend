const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const createToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
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
  console.log("signup");

  try {
    const { username, email, password } = req.body;
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: "Incorrect request format." });
  }

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
    const token = createToken({ id: user._id });
    res.status(201).json({
      success: true,
      token,
      username,
      email,
      categories: user.categories,
    });
  } catch (err) {
    if (user) {
      User.findByIdAndDelete(user._id);
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res, next) => {
  console.log("login");

  try {
    const { email, password } = req.body;
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: "Incorrect request format." });
  }

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

  const token = createToken({ id: user._id });
  res.status(200).json({
    success: true,
    token,
    username: user.username,
    email,
    categories: user.categories,
  });
};

exports.forgotPassword = async (req, res, next) => {
  console.log("forgotPassword");

  try {
    const { email } = req.body;
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: "Incorrect request format." });
  }

  if (!email) {
    res.status(400).json({ success: false, error: "Fill all details." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, error: "Invalid email" });
  }

  let token = RandomString(10);
  user.resetToken = await bcrypt.hash(token, await bcrypt.genSalt(10));
  await user.save();

  token = createToken({ email, token });
  console.log(token);

  // sendMail(email, "Reset Password", token);

  res.status(200).json({ success: true });
};

exports.resetPassword = async (req, res, next) => {
  console.log("resetPassword");

  try {
    const { email, token, password } = req.body;
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: "Incorrect request format." });
  }

  if (!email || !token || !password) {
    res.status(400).json({ success: false, error: "Fill all details." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, error: "Invalid email" });
  }

  let verification;

  try {
    verification = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }

  const verifyToken = await bcrypt.compare(verification.token, user.resetToken);

  if (!verifyToken || verification.email !== email) {
    return res.status(400).json({ success: false, error: "Invalid token" });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  user.password = hash;
  user.resetToken = undefined;
  await user.save();

  res.status(200).json({ success: true });
};
