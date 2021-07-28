// TODO:
// * Fix Proxy Error.
// * Check whether you can use Cors and proxy same time.
// * Fix accessToken Not Define.
// * Add Logout functionallity.
// * Polish Everything.
// * What is cookie-parser. And should you use It.
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/userModels");
const ErrorResponse = require("../error/errorResponse");

const app = express();
app.use(cookieParser());

exports.protect = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("No User found with this id", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Not Authorized to access this route", 401));
  }
};
