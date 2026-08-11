const express = require("express");
const router = express.Router();
const { updateProfile, getLeaderboard, getUserProfile } = require("../controllers/userController");

router.get("/leaderboard", getLeaderboard);
router.get("/:id/profile", getUserProfile);
router.put("/:id/profile", updateProfile);

module.exports = router;