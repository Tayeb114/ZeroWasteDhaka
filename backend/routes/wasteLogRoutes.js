const express = require("express");
const router = express.Router();
const { createWasteLog, getWasteLogs } = require("../controllers/wasteLogController");

router.post("/", createWasteLog);
router.get("/", getWasteLogs);

module.exports = router;
