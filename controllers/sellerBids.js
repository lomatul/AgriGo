const ErrorResponse = require("../utils/errorResponse");
const buyerOffers = require("../models/buyerOffers");
const User = require("../models/User");
const sellerBids = require("../models/sellerBids");

exports.createBid = async (req, res, next) => {
  const { sellerEmail, buyerOfferId, sellerBidAmount } = req.body;

  console.log("here!");

  try {
    let user = await buyerOffers.findById(buyerOfferId);
    if (!user) {
      return next(new ErrorResponse("This offer does not exist!", 404));
    }

    let seller = await User.findOne({ email: sellerEmail });
    if (!seller) {
      return next(new ErrorResponse("This seller does not exist!", 404));
    }

    let existingBid = await sellerBids.findOne({
      sellerEmail,
      buyerOfferId,
    });

    if (existingBid) {
      return next(
        new ErrorResponse(
          "A bid already exists for this seller and offer combination!",
          400
        )
      );
    }

    let errorMessage = null;

    if (!sellerBidAmount) {
      errorMessage = "Please provide a valid amount";
    }

    if (errorMessage) {
      return next(new ErrorResponse(errorMessage, 400));
    }

    let newSellerBid = new sellerBids({
      sellerEmail,
      buyerOfferId,
      sellerBidAmount,
    });

    await newSellerBid.save();

    console.log("Bid added!");

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    next(error);
  }
};
