const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    instructions: {
      type: String,
      default: "",
    },
    weightKg: {
      type: Number,
    },
    itemCount: {
      type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "claimed", "completed", "archived", "expired"],
      default: "available",
    },
    expires_at: {
      type: Date,
      default: () => Date.now() + 4 * 60 * 60 * 1000,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
