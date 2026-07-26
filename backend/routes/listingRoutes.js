const express = require("express");
const router = express.Router();
const {
  createListing,
  getAvailableListings,
  claimListing,
  completeListing,
} = require("../controllers/listingController");

router.post("/", createListing);
router.get("/", getAvailableListings);
router.put("/:id/claim", claimListing);
router.put("/:id/complete", completeListing);

module.exports = router;
