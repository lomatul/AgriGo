const Order = require("../models/order.model.js");
const Offer = require("../models/offer.model.js");
const createError = require("../utils/createError.js")

exports.createOrder = async (req, res, next) => {
  try {
    if(req.user.isSeller){

    }

    const offer = await Offer.findById(req.params.offerId)

    if(!offer){

    }

    const newOrder = new Order({
      offerId : offer._id,
      img : offer.cover,
      title: offer.title,
      buyerId: req.user._id,
      sellerId: offer.userId,
      price: offer.price,
      perUnit: offer.perUnit,
      quantity: req.body.quantity,
    })

    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.find({
      ...(req.user.isSeller ? {sellerId: req.user._id} : { buyerId: req.user._id})
    });

    console.log("user isSeller ", req.user.isSeller)
    console.log("userId is : ", req.user._id)
    console.log("sent orders : " + JSON.stringify(order));
    
    res.status(200).send(order);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      offerId: req.params.offerId,
      $or: [
        { sellerId: req.user._id },
        { buyerId: req.user._id }
      ]
    });
    // console.log("send order :" + JSON.stringify(order));
    res.status(200).send(order);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

