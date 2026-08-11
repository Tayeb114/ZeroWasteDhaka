const Listing = require("../models/Listing");
const User = require("../models/User");

// @desc    Post a new surplus food listing
// @route   POST /api/listings
// @access  Public (Manager role expected)
exports.createListing = async (req, res) => {
  const { title, category, weightKg, itemCount, address, imageUrl, postedBy, instructions, expires_at } = req.body;
  
  if (!title || !category || !address || !expires_at) {
    return res.status(400).json({ message: "Please fill in Food Title, Category, Pickup Location, and Expiry Time before posting." });
  }

  try {
    if (postedBy) {
      await User.findByIdAndUpdate(postedBy, { address });
    }

    const listing = await Listing.create({
      title,
      category: category || "General",
      weightKg,
      itemCount,
      location: address,
      imageUrl,
      status: "available",
      postedBy,
      instructions: instructions || "",
      expires_at: expires_at ? new Date(expires_at) : undefined,
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
    // Auto-expire listings before fetching
    await Listing.updateMany({
      status: "available",
      expires_at: { $lt: new Date() }
    }, { status: "expired" });

    const listings = await Listing.find()
      .populate("postedBy", "name email role points rescuesCompleted donationsCompleted address restaurantName")
      .populate("claimedBy", "name email role points rescuesCompleted donationsCompleted");
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};