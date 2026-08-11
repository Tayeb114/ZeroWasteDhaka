const express = require("express");
const router = express.Router();
const { initiateClaim, confirmHandover, getActiveClaims } = require("../controllers/claimController");

router.post("/", initiateClaim);
router.get("/active", getActiveClaims);
router.put("/:id/confirm", confirmHandover);

module.exports = router;