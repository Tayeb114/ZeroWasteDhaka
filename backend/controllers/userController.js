const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/:id/profile
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id/profile
// @access  Public (Should be protected in prod)
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, restaurantName, address } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (restaurantName !== undefined) user.restaurantName = restaurantName;
    if (address !== undefined) user.address = address;

    await user.save();
    
    // Send back updated user (excluding password)
    const updatedUser = await User.findById(id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};

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