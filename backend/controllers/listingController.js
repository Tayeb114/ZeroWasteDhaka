const Listing = require("../models/Listing");
const User = require("../models/User");

// @desc    Post a new surplus food listing
// @route   POST /api/listings
// @access  Public (Manager role expected)
exports.createListing = async (req, res) => {
  const { title, category, weightKg, location, imageUrl, postedBy } = req.body;
  try {
    const listing = await Listing.create({
      title,
      category,
      weightKg,
      location,
      imageUrl,
      status: "available",
      postedBy,
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch available food listings
// @route   GET /api/listings
// @access  Public
exports.getAvailableListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("postedBy", "name email role points rescuesCompleted donationsCompleted")
      .populate("claimedBy", "name email role points rescuesCompleted donationsCompleted");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Volunteer claims a listing
// @route   PUT /api/listings/:id/claim
// @access  Public (Volunteer role expected)
exports.claimListing = async (req, res) => {
  const { claimedBy } = req.body;
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.status !== "available") {
      return res.status(400).json({ message: "Listing is not available to be claimed" });
    }

    listing.status = "claimed";
    listing.claimedBy = claimedBy;
    await listing.save();

    // Re-fetch with populated fields for consistent response
    const populated = await Listing.findById(listing._id)
      .populate("postedBy", "name email role points rescuesCompleted donationsCompleted")
      .populate("claimedBy", "name email role points rescuesCompleted donationsCompleted");
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handover confirmed & completed
// @route   PUT /api/listings/:id/complete
// @access  Public
exports.completeListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.status !== "claimed") {
      return res.status(400).json({ message: "Listing must be claimed before completion" });
    }

    listing.status = "completed";
    await listing.save();

    // Increment points (+100) and counts for both manager and volunteer
    await User.findByIdAndUpdate(listing.postedBy, {
      $inc: { points: 100, donationsCompleted: 1 },
    });

    if (listing.claimedBy) {
      await User.findByIdAndUpdate(listing.claimedBy, {
        $inc: { points: 100, rescuesCompleted: 1 },
      });
    }

    res.json({ message: "Handover confirmed! Point rewards distributed.", listing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
