const buyerOffers = require("../models/buyerOffers");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.createBuyerOffer = async (req, res, next) => {
  const {
    buyerEmail,
    itemName,
    itemPrice,
    itemDescription,
    startDate,
    endDate,
    isFlexibleDate,
    selectedDate,
    itemCategory,
  } = req.body;

  try {
    let user = await User.findOne({ email: req.body.buyerEmail });
    console.log(buyerEmail);
    if (!user) {
      return next(new ErrorResponse("This buyer does not exist!", 404));
    }
    let errorMessage = null;

    if (!buyerEmail) {
      errorMessage = "Please provide a valid email";
    } else if (!itemName) {
      errorMessage = "Please provide item name";
    } else if (!itemPrice) {
      errorMessage = "Please provide item price";
    } else if (!itemCategory) {
      errorMessage = "Choose a category!";
    } else if (isFlexibleDate === "flexible" && (!startDate || !endDate)) {
      errorMessage = "Choose a date range!";
    } else if (isFlexibleDate === "notflexible" && !selectedDate) {
      errorMessage = "Choose a valid date!";
    }

    if (errorMessage) {
      return next(new ErrorResponse(errorMessage, 400));
    }

    let buyer = await buyerOffers.create({
      buyerEmail,
      itemPrice,
      itemName,
      itemDescription,
      isFlexibleDate: isFlexibleDate === "flexible", // Convert to boolean
      itemCategory,
      flexibleDateRange: {
        flexibleDateStart:
          isFlexibleDate === "flexible" ? new Date(startDate) : null,
        flexibleDateEnd:
          isFlexibleDate === "flexible" ? new Date(endDate) : null,
      },
      itemDeadline:
        isFlexibleDate === "notflexible" ? new Date(selectedDate) : null,
    });

    await buyer.save();

    console.log("offer added!");
    // // await buyer.save();

    res.status(200).json({
      success: true,
      data: buyer,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBuyerOffer = async (req, res, next) => {
  const {
    buyerId,
    itemName,
    itemPrice,
    itemDescription,
    startDate,
    endDate,
    isFlexibleDate,
    selectedDate,
    itemCategory,
  } = req.body;

  try {
    let user = await User.findOne({ _id: buyerId });
    if (!user) {
      return next(
        new ErrorResponse("There is no buyer with this account!", 404)
      );
    }

    let buyer = await buyerOffers.findOneAndUpdate(
      { buyerId },
      {
        itemName,
        itemPrice,
        itemDescription,
        isFlexibleDate,
        itemCategory,
      },
      { new: true }
    );

    if (isFlexibleDate) {
      buyer.flexibleDateRange.flexibleDateStart = startDate;
      buyer.flexibleDateRange.flexibleDateEnd = endDate;
    } else {
      buyer.selectedDate = selectedDate;
    }

    await buyer.save();

    res.status(200).json({
      success: true,
      data: buyer,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBuyerOffer = async (req, res, next) => {
  const { buyerId } = req.body;

  try {
    let user = await User.findOne({ _id: buyerId });
    if (!user) {
      return next(
        new ErrorResponse("There is no buyer with this account!", 404)
      );
    }

    let buyer = await buyerOffers.findOneAndDelete({ buyerId });

    res.status(200).json({
      success: true,
      data: buyer,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBuyerOffers = async (req, res, next) => {
  try {
    const offers = await buyerOffers.find();
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    next(error);
  }
};

exports.checkNewOffers = async (req, res, next) => {
  try {
    const newOfferCount = await buyerOffers.countDocuments({}); // Fetch the count of new offers
    res.status(200).json({ offerCount: newOfferCount }); // Return the offer count in the response
  } catch (error) {
    next(error);
  }
};

exports.getBuyerOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerOffer = await buyerOffers.findById(id);
    if (!buyerOffer) {
      return res.status(404).json({ message: "Buyer offer not found" });
    }

    // const buyerOfferData = {
    //   id: buyerOffer._id,
    //   title: buyerOffer.title,
    //   description: buyerOffer.description,
    // };

    res.json(buyerOffer);
  } catch (error) {
    console.log("Error fetching buyer offer:", error);
    res.status(500).json({ message: "Error fetching buyer offer" });
  }
};

exports.getNumberOfOffersPlaced = async (req, res) => {
  try {
    const { email } = req.query;
    // console.log(req);
    const documentCount = await buyerOffers.countDocuments({
      buyerEmail: email,
    });


    res.status(200).json({ count: documentCount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
