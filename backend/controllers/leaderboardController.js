const User = require("../models/User");

// @desc    Get leaderboard lists
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" })
      .sort({ points: -1 })
      .select("-password")
      .limit(10);

    const managers = await User.find({ role: "manager" })
      .sort({ points: -1 })
      .select("-password")
      .limit(10);

    res.json({
      volunteers,
      restaurants: managers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
