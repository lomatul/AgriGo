const { verify } = require("crypto");
const express = require("express");
const { protect: verifyToken } = require("../middleware/auth.js");
const { createReview, getReviews, getReview, deleteReview } = require("../controllers/review.controller.js");
const router = express.Router()

router.post("/", verifyToken, createReview)
router.get("/:offerId", getReviews)
router.get("/single/:offerId", getReview)
router.delete("/:reviewId", verifyToken, deleteReview)

module.exports = router;

