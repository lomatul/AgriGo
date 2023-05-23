const createError = require("../utils/createError");
const Review = require("../models/review.model.js");
const Offer = require("../models/offer.model.js");
const Order = require("../models/order.model.js");

exports.createReview = async (req, res, next) => {
    const wasmadeBySeller = req.user.isSeller;

    const newReview = new Review({
        userId: req.user._id,
        offerId: req.body.offerId,
        desc: req.body.desc,
        star: req.body.star,
        madeBySeller: wasmadeBySeller,
    })

    try {
        const review = await Review.findOne({
            offerId: req.body.offerId,
            userId: req.user._id,
        });

        if (review) {
            return next(createError(403, "Thee already created ein error for diese offer"));
        }

        // check if user purchased the offer using order model

        const order = await Order.findOne({
            offerId: req.body.offerId,
            $or: [
                { sellerId: req.user._id },
                { buyerId: req.user._id }
            ]
        });

        if (!order) {
            return next(createError(403, "Dui bu qi, you didn't order this."));
        }


        const savedReview = await newReview.save();
        await Offer.findByIdAndUpdate(req.body.offerId, {
            $inc: {
                totalStars: req.body.star,
                starNumber: 1
            },
        });
        res.status(201).send(savedReview);

    } catch (err) {
        next(err);
    }
}

exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ offerId: req.params.offerId });
        // console.log("send reviews :" + JSON.stringify(reviews));
        res.status(200).send(reviews);
    } catch (err) {
        console.log(err);
        next(err)
    }
}

exports.getReview = async (req, res, next) => {
    try {
        // const userObject = JSON.parse(req.query.user);
        // const userId = userObject.data.info._id;

        // console.log("req :", req.query.user)
        // console.log("offerId : ", req.params.offerId)
        // console.log("userId : ", req.query.user._id)

        const review = await Review.findOne({
            offerId: req.params.offerId,
            userId: req.query.user._id,
        });
        // console.log("send review :" + JSON.stringify(review));
        res.status(200).send(review);
    } catch (err) {
        console.log(err);
        next(err)
    }
}

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.reviewId,
            userId: req.user._id
        });

        if (!review) {
            return next(createError(404, "Review not found or you are not authorized to delete it."));
        }

        await Offer.findByIdAndUpdate(review.offerId, {
            $inc: {
                totalStars: -review.star,
                starNumber: -1
            },
        });

        res.status(200).send({ message: "Review deleted successfully." });
    } catch (err) {
        next(err);
    }
}


