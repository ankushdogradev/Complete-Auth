const express = require("express");
const router = express.Router();

// controllers
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  confirmEmail,
} = require("../controllers/authControllers");

router.route("/register").post(register);
router.route("/confirmation/:confirmToken").put(confirmEmail);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:resetToken").put(resetPassword);

module.exports = router;
