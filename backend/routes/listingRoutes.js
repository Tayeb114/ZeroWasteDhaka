const express = require("express");
const router = express.Router();
const {
  createListing,
  getAvailableListings,
} = require("../controllers/listingController");

router.post("/", createListing);
router.get("/", getAvailableListings);

module.exports = router;