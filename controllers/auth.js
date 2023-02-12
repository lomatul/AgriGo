const User = require("../models/User");

exports.register = async (req, res, next) => {
    const{username, email, password} = req.body;

    try{
        const user = await User.create({
            username, email, password,
        });
        res.status(201).json({
            success:true,
            user,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email||!password){
        res.status(400).json({success: false, error: "Please provide email and password"})
    }

    try{
        const user = await User.findOne({email}).select("+password");

        if(!user){
            res.status(404).json({success: false, error:"Invalid credentials"})
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            res.status(404).json({success:false,error:"Invalid credentials"})
        }

        res.status(200).json({
            success: true,
            token: "rwerwerewc22",
        });
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


