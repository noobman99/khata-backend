const { validUID } = require("../helpers/customValidator");
const User = require("../models/User");
const validator = require("validator");

exports.addFriend = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const user = req.user;

  if (user.friends.includes(friendId)) {
    return res.status(400).json({ error: "Already friends" });
  }

  if (user.uId === friendId) {
    return res.status(400).json({ error: "Cannot add self" });
  }

  if (!user.friendRequests.includes(friendId)) {
    return res
      .status(400)
      .json({
        error: "Cannot add them as friend. Ask them to send a request.",
      });
  }

  if (!validUID(friendId)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const friend = await User.findOne({ uId: friendId });

  if (!friend) {
    return res.status(404).json({ error: "User not found" });
  }

  user.friends.push(friendId);
  user.friendRequests = user.friendRequests.filter((f) => f !== friendId);
  friend.friends.push(user.uId);
  await user.save();
  await friend.save();

  res.status(200).json({ success: true, error: "Friend added" });
};

exports.removeFriend = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const user = req.user;

  if (!user.friends.includes(friendId)) {
    return res.status(400).json({ error: "Not friends" });
  }

  if (!validUID(friendId)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const friend = await User.findOne({ uId: friendId });

  user.friends = user.friends.filter((f) => f !== friendId);
  friend.friends = friend.friends.filter((f) => f !== user.uId);
  await user.save();
  await friend.save();

  res.status(200).json({ success: true, error: "Friend removed" });
};

exports.getFriends = async (req, res, next) => {
  const user = req.user;

  let friends = [];

  for (let i = 0; i < user.friends.length; i++) {
    let friend = await User.findOne({ uId: user.friends[i] });
    friends.push({
      username: friend.username,
      uId: friend.uId,
    });
  }

  res.status(200).json(friends);
};

exports.friendRequest = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const user = req.user;

  if (user.friends.includes(friendId)) {
    return res.status(400).json({ error: "Already friends" });
  }

  if (user.uId === friendId) {
    return res.status(400).json({ error: "Cannot add self" });
  }

  if (!validUID(friendId)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const friend = (await User.find({ uId: friendId }))[0];

  if (!friend) {
    return res.status(404).json({ error: "User not found" });
  }

  if (friend.friendRequests.includes(user.uId)) {
    return res.status(400).json({ error: "Request already sent" });
  }

  friend.friendRequests.push(user.uId);
  await friend.save();

  res.status(200).json({ success: true, error: "Friend request sent" });
};

exports.removeFriendRequest = async (req, res, next) => {
  let friendId;
  try {
    friendId = req.body.friendId;
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const user = req.user;

  console.log(user.friendRequests, friendId);

  if (!user.friendRequests.includes(friendId)) {
    return res.status(400).json({ error: "Request not sent" });
  }

  if (!validUID(friendId)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  user.friendRequests = user.friendRequests.filter((f) => f !== friendId);
  await user.save();

  res.status(200).json({ success: true, error: "Friend request removed" });
};

exports.getFriendRequests = async (req, res, next) => {
  const user = req.user;

  let friendRequests = [];

  for (let i = 0; i < user.friendRequests.length; i++) {
    let friend = await User.findOne({ uId: user.friendRequests[i] });
    friendRequests.push({
      username: friend.username,
      uId: friend.uId,
    });
  }

  res.status(200).json(friendRequests);
};

exports.getProfile = async (req, res, next) => {
  const user = req.user;

  let userInfo = {
    email: user.email,
    username: user.username,
    categories: user.categories,
    uId: user.uId,
  };

  res.status(200).json({ user: userInfo });
};
