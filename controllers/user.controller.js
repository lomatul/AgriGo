// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import createError from "../utils/createError.js";
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError.js");

const deleteUser = async(req, res, next)=>{
    const user = await User.findById(req.params.id)
  
    if(req.userId !== user._id.toString()){
        return next(createError(403, "You can only delete your own account o_o)"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(201).send("thine account was sucessfully removed, plz don leave us QAQ");
};

const getUser = async(req, res, next) =>{
    const user = await User.findById(req.params.id)
    res.status(200).send(user);
}

module.exports = { deleteUser, getUser };