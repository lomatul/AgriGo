const express = require("express");
const { protect: verifyToken } = require("../middleware/auth.js");
const { createOrder, getOrders, getOrder } = require("../controllers/order.controller.js");

const router = express.Router()

router.post("/:offerId", verifyToken, createOrder );
router.get("/", verifyToken, getOrders );
router.get("/:offerId", verifyToken, getOrder );

module.exports = router;

