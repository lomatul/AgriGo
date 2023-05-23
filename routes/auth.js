const express = require("express");

const router = express.Router();

const {
  register,
  login,
  forgotpassword,
  resetpassword,
  verifyemail,
  fetchuserinfo,
  resendverificationlink,
  completeregistration,
  checkforvalidtoken,
} = require("../controllers/auth");

router.route("/register").post(register);
router.route("/checkforvalidtoken/:resetToken").get(checkforvalidtoken);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/resetpassword/:resetToken").put(resetpassword);
router.route("/verifyemail/:token").get(verifyemail);
router.route("/resendverificationlink").post(resendverificationlink);
router.route("/fetchuserinfo").get(fetchuserinfo);
router.route("/completeregistration").post(completeregistration);
module.exports = router;
