const mongoose = require("mongoose");
const { Schema } = mongoose;

const OfferSchema = new Schema({
    userId:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: true,
    },
    totalStars:{
        type: Number,
        dafault: 0,
    },
    starNumber:{
        type: Number,
        default: 0,
    },
    cat:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    cover:{
        type: String,
        required: true,
    },
    images:{
        type: [String],
        required: false,
    },
    shortTitle:{
        type: String,
        required: true,
    },
    shortDesc:{
        type: String,
        required: true,
    },
    deliveryTime:{
        type: Number,
        required: true,
    },
    perUnit:{
        type: String,
        required: true,
    },
    features:{
        type: [String],
        required: false,
    },
    sales:{
        type: 0,
        default: 0,
    },
    
},{
    timestamps: true
});

module.exports = mongoose.model("Offer", OfferSchema)