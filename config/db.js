const mongoose = require("mongoose");

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log("Mongo connected!");
}


module.exports = connectDB;