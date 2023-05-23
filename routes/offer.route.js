const express = require("express")
// import {
//     createOffer,
//     deleteOffer,
//     getOffer,
//     getOffers
// } from "../controllers/offer.controller.js";
// import {verifyToken} from "../middleware/jwt.js"
const { createOffer, deleteOffer, getOffer, getOffers } = require("../controllers/offer.controller.js");
const { protect: verifyToken } = require("../middleware/auth.js");

const router = express.Router()

router.post("/", verifyToken, createOffer);
router.delete("/:id", verifyToken, deleteOffer);
router.get("/single/:id", getOffer); // id is offerId, get a single offer by ID
router.get("/", getOffers); // get all the offers based on search params

module.exports = router;

