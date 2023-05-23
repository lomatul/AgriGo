const createError = require("../utils/createError.js");
const Conversation = require("../models/conversation.model.js");

exports.createConversation = async (req, res, next) => {
    const newConversation = new Conversation({
        id: req.user.isSeller ? req.user._id + req.body.to : req.body.to + req.user._id,
        sellerId: req.user.isSeller ? req.user._id : req.body.to,
        buyerId: req.user.isSeller ? req.body.to : req.user._id,
        readBySeller: req.user.isSeller,
        readByBuyer: !req.user.isSeller,
    });

    try {
        const savedConversation = await newConversation.save();
        console.log("created thy conversation: ", savedConversation);
        res.status(201).send(savedConversation);
    } catch (err) {
        next(err);
    }
};


exports.updateConversation = async (req, res, next) => {
    try {
        const updatedConversation = await Conversation.findOneAndUpdate(
            { id: req.params.id },
            {
                $set: {
                    // readBySeller: true,
                    // readByBuyer: true,
                    ...(req.user.isSeller ? { readBySeller: true } : { readByBuyer: true }),
                },
            },
            { new: true }
        );

        console.log("updated thy conversation: ", updatedConversation);
        res.status(200).send(updatedConversation);
    } catch (err) {
        console.log(err)
        next(err);
    }
};

exports.getSingleConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.id });
        if (!conversation) return next(createError(404, "Not found!"));
        res.status(200).send(conversation);
    } catch (err) {
        next(err);
    }
};

exports.getConversations = async (req, res, next) => {
    try {
        const conversations = await Conversation.find(
            req.user.isSeller ? { sellerId: req.user._id } : { buyerId: req.user._id }
        ).sort({ updatedAt: -1 });

        // console.log("sent thy conversations: ", conversations);

        res.status(200).send(conversations);
    } catch (err) {
        next(err);
    }
};