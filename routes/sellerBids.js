const express = require("express");
const router = express.Router();

const {
    createBid,
//   getBidCount,
//   getAllBids,
//   getBid,
//   updateBid,
//   deleteBid,
} = require("../controllers/sellerBids");

router.route("/createBid").post(createBid);
// router.route("/getAllBids").get(getAllBids);
// router.route("/updateBid/:bidId").post(updateBid);
// router.route("/getBid").get(getBid);
// router.route("/deleteBid/:bidId").delete(deleteBid);
// router.route("/getBidCount").get(getBidCount);

module.exports = router;
