const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
    offerId:{
        type: String,
        required: true,
    },
    sellerId:{
        type: String,
        required: true,
    },
    buyerId:{
        type: String,
        required: true,
    },
    img:{
        type:String,
    },
    title: {
        type: String,
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
    },
    perUnit:{
        type: String,
        required: true,
    },
    isCompleted:{
        type: Boolean,
        default: false,
    },
    payment_method:{
        type: String,
        default: "Cash on Delivery",
    },
    
},{
    timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema)

// this is only for offers that buyers purchase, instant purchase offers
// maybe another trigger for when time passes after delivery date and is not completed
// allow sellers to mark completed