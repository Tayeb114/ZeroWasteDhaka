const WasteLog = require("../models/WasteLog");
const Listing = require("../models/Listing");

// @desc    Log a new kitchen waste entry
// @route   POST /api/waste-logs
// @access  Public (Manager expected)
exports.createWasteLog = async (req, res) => {
  const { foodName, quantity, unit, disposalDate, managerId } = req.body;
  try {
    const log = await WasteLog.create({
      foodName,
      quantity,
      unit: unit || "kg",
      disposalDate: disposalDate || new Date(),
      managerId,
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all waste log entries and calculate totals
// @route   GET /api/waste-logs
// @access  Public
exports.getWasteLogs = async (req, res) => {
  try {
    const logs = await WasteLog.find().sort({ disposalDate: -1 }).populate("managerId", "name");

    // Avoided Financial Loss corresponds to completed rescues * standard value multiplier (e.g. ৳250 / kg)
    const completedListings = await Listing.find({ status: "completed" });
    const totalRescuedWeight = completedListings.reduce((sum, item) => sum + (item.weightKg || 0), 0);
    const avoidedFinancialLoss = totalRescuedWeight * 250; // ৳250 Taka per kg of rescued food

    res.json({
      logs,
      avoidedFinancialLoss,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};