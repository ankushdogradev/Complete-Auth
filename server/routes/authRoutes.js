// https://www.youtube.com/watch?v=Rb05ioLMDtM&t=945s
const express = require("express");
const router = express.Router();

// controllers
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  confirmEmail,
  refresh,
  logout,
} = require("../controllers/authControllers");

router.route("/register").post(register);
router.route("/confirmation/:confirmToken").put(confirmEmail);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);
router.route("/logout").get(logout);

router.route("/refresh").post(refresh);

module.exports = router;
