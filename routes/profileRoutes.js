const express = require("express");
const router = express.Router();
const profileControls = require("../controllers/profileControls");
const authenticator = require("../middleware/authenticator");

router.use(authenticator);

router.get("/", profileControls.getProfile);
router.post("/addfriend", profileControls.friendRequest);
router.post("/removefriend", profileControls.removeFriend);
router.post("/acceptfriend", profileControls.addFriend);
router.post("/rejectfriend", profileControls.removeFriendRequest);
router.get("/friends", profileControls.getFriends);
router.get("/friendrequests", profileControls.getFriendRequests);

module.exports = router;
