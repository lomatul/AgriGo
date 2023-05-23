const crypto = require("crypto");
const Token = require("../models/token");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const getEmailBody = require("../utils/getEmailBody");
// const port = require("../process.env");

exports.register = async (req, res, next) => {
  const { isSeller, firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(
        new ErrorResponse("User with given email already exists!", 400)
      );
    }

    console.log(req.body);

    user = await User.create({
      isSeller,
      firstName,
      lastName,
      email,
      password,
    });

    let token = await new Token({
      email: user.email,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = getEmailBody(
      `http://localhost:5000/api/auth/verifyemail/${token.token}`,
      req.body.firstName + " " + req.body.lastName
    );
    await sendEmail(
      user.email,
      "Please Verify Your Email Address for Agrigo",
      message
    );
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.resendverificationlink = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorResponse("User does not exist!", 400));
    }
    if (user && user.isVerified == true) {
      return next(new ErrorResponse("User is already verified", 400));
    }

    let token = await new Token({
      email: user.email,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = getEmailBody(
      `http://localhost:5000/api/auth/verifyemail/${token.token}`
    );
    await sendEmail(user.email, "Verify your Account", message);
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.verifyemail = async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.params.token });

    let user;
    if (!token) {
      res.redirect("http://localhost:5173/Pagenotfound");

      // return next(new ErrorResponse("Invalid Link", 400));
    } else {
      console.log("token paisi!");
      user = await User.findOne({ email: token.email });

      if (!user) {
        return next(new ErrorResponse("User doesn't exist!", 400));
      } else {
        console.log("user paisi!");
      }
    }

    // await User.findByIdAndUpdate(user.email, {isVerified: true });
    await User.findOneAndUpdate(
      {
        email: user.email,
      },
      { isVerified: true }
    );
    await Token.deleteMany({ email: user.email });

    res.redirect("http://localhost:5173/Login");
  } catch (error) {
    next(new ErrorResponse("An error occured", 400));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    if (!user.isVerified) {
      return next(new ErrorResponse("Not yet verified, redirecting...", 403));
      // forbidden
      // imagine they didnt get a mail and they lost the account verification page, shouldnt we allow them to access it again?
      // should we navigate?
    }

    const fininfo = await User.findOne({ email });
    // if(fininfo.hasCompletedRegistration)
    const token = user.getSignedToken();
    const { ...info } = fininfo._doc;

    const response = {
      success: true,
      token,
      info,
    };
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken", {
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .send("Thee haz been logged outz");
  } catch (err) {
    console.log(err);
  }
};

exports.forgotpassword = async (req, res, next) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    // const resetUrl = `http://localhost:5000/resetpassword/${resetToken}`;
    const resetUrl = `http://localhost:5173/Resetpassword/${resetToken}`;

    // HTML Message
    const message = `
        <h1>You have requested a password reset</h1>
        <p>Please make a put request to the following link:</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      `;

    try {
      // await sendEmail({
      //     to: user.email,
      //     subject: "Password Reset Request",
      //     text: message,
      // });
      await sendEmail(user.email, "Password reset", message);
      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      console.log(error);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.resetpassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedToken(),
    });
  } catch (err) {
    next(err);
  }
};

exports.completeregistration = async (req, res, next) => {
  try {
    const { email, companyName, country, phone, desc } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return next(new ErrorResponse("User not found", 404));
    }

    if (!companyName) {
      return next(new ErrorResponse("Please enter your company name", 400));
    }

    if (!phone) {
      return next(new ErrorResponse("Please enter your phone number", 400));
    }

    if (!desc) {
      return next(new ErrorResponse("Please enter a description", 400));
    }

    findUser.companyName = companyName;
    findUser.country = country;
    findUser.phone = phone;
    findUser.desc = desc;
    findUser.hasCompletedRegistration = true;
    await findUser.save();

    console.log("User updated!");
    res.status(200).json("updatedUser");
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("An error occurred", 500));
  }
};

exports.fetchuserinfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "An error occurred" });
  }
};

exports.checkforvalidtoken = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    console.log(resetPasswordToken);
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
    console.log("I'm herer!");
    if (!user) {
      // res.redirect("http://localhost:5173/Pagenotfound");
      return next(new ErrorResponse("Invalid Token", 400));
    }

    res.status(201).json({ success: true, data: "Token is valid" });
  } catch (error) {
    next(error);
  }
};

function sendToken(user, statusCode, res) {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
}
