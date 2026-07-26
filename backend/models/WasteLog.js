const mongoose = require("mongoose");

const WasteLogSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    weightKg: {
      type: Number,
      required: true,
    },
    disposalDate: {
      type: Date,
      default: Date.now,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WasteLog", WasteLogSchema);
