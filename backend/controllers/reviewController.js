const Review = require("../models/Review");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Notification = require("../models/Notification");

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { claim_id, reviewer_id, target_user_id, rating, comment } = req.body;

    if (!claim_id || !reviewer_id || !target_user_id || !rating) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const review = await Review.create({
      claim_id,
      reviewer_id,
      target_user_id,
      rating,
      comment,
    });

    // Recalculate average rating for the target user
    const reviews = await Review.find({ target_user_id });
    const ratingCount = reviews.length;
    let ratingAverage = 5.0;
    if (ratingCount > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      ratingAverage = (sum / ratingCount).toFixed(1);
    }

    await User.findByIdAndUpdate(target_user_id, {
      ratingCount,
      ratingAverage: parseFloat(ratingAverage),
    });

    try {
      const reviewer = await User.findById(reviewer_id);
      const Claim = require("../models/Claim");
      const claim = await Claim.findById(claim_id).populate("listing_id");
      
      await Notification.create({
        user_id: target_user_id,
        title: "New Feedback Received",
        message: `${reviewer ? reviewer.name : 'A volunteer'} left a ${rating}-star rating and review for ${claim && claim.listing_id ? claim.listing_id.title : 'a pickup'}.`
      });
    } catch (notifErr) {
      console.error("Error creating notification:", notifErr);
    }

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ target_user_id: userId })
      .populate("reviewer_id", "name email role")
      .sort({ createdAt: -1 });

    const targetUser = await User.findById(userId).select("bio address name restaurantName role");
    const averageRating = targetUser ? targetUser.ratingAverage : 5.0;

    res.json({
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length,
      reviews,
      targetUser,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
};