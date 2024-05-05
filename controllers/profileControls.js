const User = require("../models/User");
const validator = require("validator");

exports.addFriend = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = req.user;

  if (user.friends.includes(friendId)) {
    return res.status(400).json({ message: "Already friends" });
  }

  if (user.email === friendId) {
    return res.status(400).json({ message: "Cannot add self" });
  }

  if (!validator.isEmail(friendId)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const friend = await User.findOne({ email: friendId });

  if (!friend) {
    return res.status(404).json({ message: "User not found" });
  }

  user.friends.push(friendId);
  friend.friends.push(user.email);
  await user.save();
  await friend.save();

  res.status(200).json({ success: true, message: "Friend added" });
};

exports.removeFriend = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = req.user;

  if (!user.friends.includes(friendId)) {
    return res.status(400).json({ message: "Not friends" });
  }

  if (!validator.isEmail(friendId)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const friend = await User.findOne({ email: friendId });

  user.friends = user.friends.filter((f) => f !== friendId);
  friend.friends = friend.friends.filter((f) => f !== user.email);
  await user.save();
  await friend.save();

  res.status(200).json({ success: true, message: "Friend removed" });
};

exports.getFriends = async (req, res, next) => {
  const user = req.user;

  let friends = [];

  for (let i = 0; i < user.friends.length; i++) {
    let friend = await User.findOne({ email: user.friends[i] });
    friends.push({ email: friend.email, username: friend.username });
  }

  res.status(200).json({ friends });
};

exports.friendRequest = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = req.user;

  if (user.friends.includes(friendId)) {
    return res.status(400).json({ message: "Already friends" });
  }

  if (user.friendRequests.includes(friendId)) {
    return res.status(400).json({ message: "Request already sent" });
  }

  if (user.email === friendId) {
    return res.status(400).json({ message: "Cannot add self" });
  }

  if (!validator.isEmail(friendId)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const friend = await User.findOne({ email: friendId });

  if (!friend) {
    return res.status(404).json({ message: "User not found" });
  }

  user.friendRequests.push(friendId);
  await user.save();

  res.status(200).json({ success: true, message: "Friend request sent" });
};

exports.removeFriendRequest = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const user = req.user;

  if (!user.friendRequests.includes(friendId)) {
    return res.status(400).json({ message: "Request not sent" });
  }

  if (!validator.isEmail(friendId)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  user.friendRequests = user.friendRequests.filter((f) => f !== friendId);
  await user.save();

  res.status(200).json({ success: true, message: "Friend request removed" });
};

exports.getFriendRequests = async (req, res, next) => {
  const user = req.user;

  let friendRequests = [];

  for (let i = 0; i < user.friendRequests.length; i++) {
    let friend = await User.findOne({ email: user.friendRequests[i] });
    friendRequests.push({ email: friend.email, username: friend.username });
  }

  res.status(200).json({ requests: friendRequests });
};

exports.getProfile = async (req, res, next) => {
  const user = req.user;

  let userInfo = {
    email: user.email,
    username: user.username,
    categories: user.categories,
  };

  res.status(200).json({ user: userInfo });
};
