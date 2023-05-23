const express = require("express");

const router = express.Router();

const {
    createBuyerOffer,
    updateBuyerOffer,
    deleteBuyerOffer,
    getAllBuyerOffers,
    checkNewOffers,
    getBuyerOfferById,
    getNumberOfOffersPlaced,
} = require("../controllers/buyerOffers");

router.route("/createBuyerOffer").post(createBuyerOffer);
router.route("/updateBuyerOffer").post(updateBuyerOffer);
router.route("/deleteBuyerOffer").post(deleteBuyerOffer);
router.route("/getAllBuyerOffers").get(getAllBuyerOffers);
router.route("/checkNewOffers").get(checkNewOffers);
router.route("/getBuyerOfferById/:id").get(getBuyerOfferById);
router.route("/getNumberOfOffersPlaced").get(getNumberOfOffersPlaced);

module.exports = router;
