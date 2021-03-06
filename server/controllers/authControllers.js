const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("../models/userModels");
const ErrorResponse = require("../error/errorResponse");
const sendEmail = require("../utils/sendEmail");

let refreshTokens = [];

const app = express();
app.use(cookieParser());

//  @description: Register
//  @route: POST /api/register
//  @access: Public
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

//  @description: Confirm Email
//  @route: PUT /api/confirmation/:confirmToken
//  @access: Public
exports.confirmEmail = async (req, res, next) => {
  const verifyEmailToken = crypto
    .createHash("sha256")
    .update(req.params.confirmToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      verifyEmailToken,
      verifyEmailExpired: { $gt: Date.now() }, // current date < expired date : gt stands for greater
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Confirmation Token", 400));
    }

    // user.password = req.body.password;
    user.isVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailExpired = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Email verification Success",
    });
  } catch (error) {
    next(error);
  }
};

//  @description: Login
//  @route: POST /api/login
//  @access: Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please enter credentials properly", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Email not registered", 401));
    }

    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse("Invalid Password", 401));
    }

    // Sending Email if not Verified
    if (!user.isVerified) {
      try {
        const confirmToken = user.getVerifyEmailToken();
        await user.save();

        const confirmUrl = `http://localhost:3000/confirmation/${confirmToken}`;
        console.log("confirmURL: ", confirmUrl);

        const html = `
      <h1>VERIFY YOUR EMAIL</h1>
      <p>Please verify your Email by clicking on the following link:</p>
      <a href=${confirmUrl} clicktracking=off>${confirmUrl}</a>
    `;

        const message = `Verify your Email. Click on the fllowing link: ${confirmUrl}`;
        try {
          await sendEmail({
            to: user.email,
            subject: "VERIFICATION MAIL",
            text: message,
            html: html,
          });

          res.status(200).json({
            success: true,
            data: "A verification mail is send to your email. Please confirm before login",
          });
          return;
        } catch (err) {
          user.verifyEmailToken = undefined;
          user.verifyEmailExpired = undefined;

          await user.save();
          next(new ErrorResponse("Email could not be sent", 500));
        }
      } catch (error) {
        next(error);
      }
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//  @description: Forgot Password
//  @route: POST /api/forgotPassword
//  @access: Public
exports.forgotPassword = async (req, res, next) => {
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
    const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;

    console.log("RESET URL: ", resetUrl);

    // HTML Message
    const html = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    const message = `You have requested a password reset. Please make a put request to the following link: ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
        html: html,
      });

      res.status(200).json({ success: true, data: "Reset Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpired = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
};

//  @description: Reset Password
//  @route: PUT /api/resetPassword
//  @access: Public
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpired: { $gt: Date.now() }, // current date < expired date : gt stands for greater
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save();
    res.status(201).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const accessToken = user.getSignedJwtAccessToken();
  const refreshToken = user.getSignedJwtRefreshToken();
  refreshTokens.push(refreshToken);

  res
    .status(statusCode)
    .cookie("accessToken", accessToken, {
      expires: new Date(new Date().getTime() + 30 * 1000),
      sameSite: "strict",
      httpOnly: true,
    }) // Dummie Cookie
    .cookie("authSession", true, {
      expires: new Date(new Date().getTime() + 30 * 1000),
    })
    .cookie("refreshToken", refreshToken, {
      expires: new Date(new Date().getTime() + 31557600000),
      sameSite: "strict",
      httpOnly: true,
    })
    .cookie("refreshTokenID", true, {
      expires: new Date(new Date().getTime() + 31557600000),
    })
    .json({ success: true });
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(
        new ErrorResponse("Refresh Token not Found, Please login again", 403)
      );
    }

    if (!refreshTokens.includes(refreshToken)) {
      return next(
        new ErrorResponse("Refresh Token Blocked!, Please login again", 403)
      );
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, payload) => {
        if (err) {
          return next(new ErrorResponse("Invalid Refresh token", 403));
        } else {
          if (!err) {
            const user = await User.findById(payload.id);
            const accessToken = user.getSignedJwtAccessToken();

            return res
              .cookie("accessToken", accessToken, {
                expires: new Date(new Date().getTime() + 30 * 1000),
                sameSite: "strict",
                httpOnly: true,
              }) //Dummie Cookie
              .cookie("authSession", true, {
                expires: new Date(new Date().getTime() + 30 * 1000),
              })
              .send({ previousSessionExpired: true, success: true });
          }
        }
        // console.log("REFRESH PAYLOAD: ", payload.id);
        // const user = await User.findById(payload.id);
        // const userID = user.id;
      }
    );
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .clearCookie("authSession")
      .clearCookie("refreshTokenID")
      .send("logout");
  } catch (error) {
    next(error);
  }
};
