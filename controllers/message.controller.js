const createError = require("../utils/createError.js");
const Message = require("../models/message.model.js");
const Conversation = require("../models/conversation.model.js");


exports.createMessage = async (req, res, next) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.user._id,
        desc: req.body.desc,
    });
    try {
        const savedMessage = await newMessage.save();
        await Conversation.findOneAndUpdate(
            { id: req.body.conversationId },
            {
                $set: {
                    readBySeller: req.user.isSeller,
                    readByBuyer: !req.user.isSeller,
                    lastMessage: req.body.desc,
                },
            },
            { new: true }
        );

        res.status(201).send(savedMessage);
    } catch (err) {
        console.log(err)
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.id });
        res.status(200).send(messages);
    } catch (err) {
        console.log(err)
        next(err);
    }
};