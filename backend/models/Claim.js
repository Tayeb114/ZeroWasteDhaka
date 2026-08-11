const mongoose = require("mongoose");

const ClaimSchema = new mongoose.Schema(
  {
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["initiated", "completed", "cancelled"],
      default: "initiated",
    },
    claimed_at: {
      type: Date,
      default: Date.now,
    },
    completed_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", ClaimSchema);
