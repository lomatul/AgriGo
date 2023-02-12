const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.register = async (req, res, next) => {
    const{username, email, password} = req.body;

    try{
        const user = await User.create({
            username, email, password,
        });
        // res.status(201).json({
        //     success:true,
        //     token: "234324",
        // });

        sendToken(user, 201, res);
    }catch(error){
        //replacing with new errorhandler stuff
        next(error);
        // res.status(500).json({
        //     success: false,
        //     error: error.message,
        // });
    }
};

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
    // Check that user exists by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check that password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendToken(user, 200, res);
    }catch(error){
        res.status(500).json({success:false, error: error.message});
    }

    // res.send("Login Route");
};

exports.forgotpassword = (req, res, next) => {
    res.send("Forgot Password Route");
};

exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route");
};


const sendToken = (user, statusCode,res)=>{
    const token = user.getSignedToken();
    res.status(statusCode).json({success:true,token})
};