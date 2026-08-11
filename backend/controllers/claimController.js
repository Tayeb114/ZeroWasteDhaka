const Claim = require("../models/Claim");
const Listing = require("../models/Listing");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Initiate a claim
// @route   POST /api/claims
// @access  Public
exports.initiateClaim = async (req, res) => {
  const { listing_id, receiver_id } = req.body;
  try {
    const listing = await Listing.findById(listing_id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.status !== "available") return res.status(400).json({ message: "Listing not available to be claimed" });

    listing.status = "claimed";
    listing.claimedBy = receiver_id; // maintain backwards compat for a moment
    await listing.save();

    const claim = await Claim.create({
      listing_id,
      receiver_id,
    });

    if (listing.postedBy) {
      await Notification.create({
        user_id: listing.postedBy,
        title: "New Claim",
        message: "Volunteer is coming for pickup"
      });
    }

    const populatedClaim = await Claim.findById(claim._id)
      .populate({
        path: "listing_id",
        populate: { path: "postedBy", select: "name email restaurantName address points donationsCompleted" }
      })
      .populate("receiver_id", "name email role rescuesCompleted points");

    res.status(201).json(populatedClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm handover
// @route   PUT /api/claims/:id/confirm
// @access  Public
exports.confirmHandover = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    if (claim.status !== "initiated") return res.status(400).json({ message: "Claim must be initiated" });

    claim.status = "completed";
    claim.completed_at = Date.now();
    await claim.save();

    const listing = await Listing.findById(claim.listing_id);
    if (listing) {
      listing.status = "archived"; // Remove from active feeds
      await listing.save();
      
      // Manager rewards
      await User.findByIdAndUpdate(listing.postedBy, {
        $inc: { points: 100, donationsCompleted: 1 },
      });
    }

    // Volunteer rewards
    const volunteer = await User.findByIdAndUpdate(claim.receiver_id, {
      $inc: { points: 100, rescuesCompleted: 1 },
    });

    if (listing && listing.postedBy) {
      await Notification.create({
        user_id: listing.postedBy,
        title: "Handover Confirmed",
        message: `Volunteer ${volunteer ? volunteer.name : 'Unknown'} completed pickup for ${listing.title}`
      });
    }

    res.json({ message: "Handover confirmed! Point rewards distributed.", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch active claims (initiated)
// @route   GET /api/claims/active
// @access  Public
exports.getActiveClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ status: "initiated" })
      .populate({
        path: "listing_id",
        populate: { path: "postedBy", select: "name email restaurantName address points donationsCompleted" }
      })
      .populate("receiver_id", "name email role rescuesCompleted points");
      
    // Apply in-memory filter if query params exist (to fulfill explicit Manager donor_id matching request)
    let result = claims;
    if (req.query.managerId) {
      result = claims.filter(c => c.listing_id && c.listing_id.postedBy && c.listing_id.postedBy._id.toString() === req.query.managerId);
    }
    if (req.query.volunteerId) {
      result = claims.filter(c => c.receiver_id && c.receiver_id._id.toString() === req.query.volunteerId);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};