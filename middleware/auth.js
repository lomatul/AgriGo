const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


exports.protect = async (req, res, next) => {
    let token;
  
    // Check if the token is present in the "Authorization" header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    // If token not found in the header, check the "accessToken" cookie
    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
  
    if (!token) {
      // No token was found
      return next(new ErrorResponse("Not authorized to access this route, no token", 401));
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return next(new ErrorResponse("No user found with this id", 404));
      }
  
      req.user = user;
  
      next();
    } catch (error) {
      console.log(error);
      return next(new ErrorResponse("Not authorized to access this route, invalid token", 401));
    }
  };
  
