// import Offer from "../models/offer.model.js";
// import createError from "../utils/createError.js";

const ErrorResponse = require("../utils/errorResponse.js");

const Offer = require("../models/offer.model.js");
const createError = require("../utils/createError.js");


exports.createOffer = async (req, res, next)=>{
    if(!req.user.isSeller){
        console.log("You are not a seller desu");
        // return next(createError(403, "Only sellerz can create ein Offer"));
        return next(new ErrorResponse("Only sellerz can create ein offer", 403));
    }
    const newOffer = new Offer({
        userId: req.user._id,
        ...req.body,
    });
    try{
        const savedOffer = await newOffer.save();
        console.log("Order created desu");
        res.status(201).json(savedOffer);
    }catch(err){
        console.log("some error desu : " + err);
        next(err);
    }

};
exports.deleteOffer = async (req, res, next)=>{
    try{
        const offer = await Offer.findById(req.params.id);
        if(!offer){
            return next(createError(404, "can't find thy offer"));
        }

        if(offer.userId !== JSON.stringify(req.user._id).replace(/^"(.*)"$/, '$1') ){ 
            return next(createError(403,"You can only delez thy own offer"))
        }

        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).send("offer has been deleted!");

    }catch(err){
        console.log(err);
        next(err);
    }
};
exports.getOffer = async (req, res, next)=>{
    try{
        const offer = await Offer.findById(req.params.id);
        if(!offer){
            return next(createError(404, "Offer not faund"));
        }

        res.status(200).send(offer);
    }catch(err){
        console.log(err);
        next(err);
    }
};
exports.getOffers = async (req, res, next)=>{
    const q = req.query;
    const filters = 
    {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && 
        {
          price: 
          {
            ...(q.min && { $gt: q.min }),
            ...(q.max && { $lt: q.max }),
          },
        }),
        ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    try{
        const offers = await Offer.find(filters).sort({[q.sort]: -1});
        console.log("I sent : " + offers)
        res.status(200).send(offers);
    }catch(err){
        console.log(err);
        next(err);
    }
};