const mongoose = require("mongoose");

const WasteLogSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "kg",
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
