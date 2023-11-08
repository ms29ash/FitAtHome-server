const express = require("express");
//bcrypt for password hashing
const bcrypt = require("bcrypt");
//json web token auth
const jwt = require("jsonwebtoken");
//user model
const User = require("../models/User.js");
//dotenv (env variables)
require("dotenv/config");
//Verify otp schema
const UserVerify = require("../models/UserVerification.js");
//express validator validating req body
const { body, validationResult } = require("express-validator");

//two step auth validation
const nodemailer = require("nodemailer");

const fetchIds = require("../middleware/verifyUser.js");

//otp generator
const otpGenerator = require("otp-generator");

//moment for time format
const moment = require("moment");
const { Box } = require("../models/Box.js");
const UserData = require("../models/UserData.js");

//create express router
const authRouter = express.Router();
//salt rounds for password hashing
const saltRounds = 10;
//secret for jwt token
const JWT_SECRET = process.env.JWT_SECRET;
//moment time
const present = new Date();
const endtime = moment().add(5, "m").utc("+05:30");

//nodemailer stuff
let transporter = nodemailer.createTransport({
  service: "gmail",
  // port: 2525,
  // secure: false,
  auth: {
    host: "smtp.gmail.com",
    type: "OAuth2",
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let success = false;

/* ------------------------- //Route:1 Signup Route ------------------------- */
authRouter.post(
  "/signup",
  //Validation using express validator
  [
    body("name", "Enter your Name").not().isEmpty().isLength({ min: 2 }),
    body("email", "Enter a valid email").not().isEmpty().isEmail(),
    body("password", "Enter a Strong Password")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    //validation Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //change letter
      return res
        .status(500)
        .json({ success: false, errorMessage: errors.array() });
    }
    try {
      //create new user
      let user = await User.findOne({ email: req.body.email });
      //finding user in database
      if (user) {
        return res.status(400).json({
          success: false,
          errorMessage: "Sorry the user already exists",
        });
      }
      //generating salt
      const salt = await bcrypt.genSalt(saltRounds);
      //hashing password
      const securePassword = await bcrypt.hash(req.body.password, salt);

      //Creating user and saving in database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      let otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const userverify = await UserVerify.findOne({ email: req.body.email });
      OtpVerify = {
        email: req.body.email,
        OTP: otp,
      };
      if (userverify) {
        await UserVerify.findOneAndUpdate(
          { email: req.body.email },
          { OTP: otp, createdAt: present, expireAt: endtime }
        );
      } else {
        await UserVerify.create(OtpVerify);
      }

      //mail options
      let mailOptions = {
        from: process.env.AUTH_USER,
        to: req.body.email,
        subject: "FITATHOME verification code",
        text: `verification code for Fitathome is ${OtpVerify.OTP}`,
      };

      //send email
      transporter.sendMail(mailOptions, (errors, data) => {
        if (errors) {
          console.log("Errors " + errors);
          res
            .status(400)
            .json({ success: false, errorMessage: "Server Error" });
        } else {
          console.log("Email sent successfully");
          success = true;
          res.json({
            success: success,
            userId: OtpVerify.email,
            message: "verification code is sent successfully",
          });
        }
      });
      res.json({ success: true });
    } catch (errors) {
      console.log(errors.message);
      res
        .status(500)
        .json({ success: false, errorMessage: "internal server error" });
    }
  }
);

/* ------------------------------ Verify Route------------------------------ */
authRouter.post(
  "/verify",
  [
    body("email", "Enter a valid email").not().isEmpty().isEmail(),
    body("otp", "Enter right otp").not().isEmpty().isLength({ min: 4, max: 4 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //change letter
      return res
        .status(500)
        .json({ success: false, errorMessage: errors.array() });
    }

    try {
      let email = req.body.email;
      let otp = req.body.otp;

      let userVerify = await UserVerify.findOne({ email: email });
      if (!userVerify) {
        return res
          .status(400)
          .send({ success: false, errorMessage: "User not found" });
      } else {
        if (userVerify.expireAt < present) {
          return res
            .status(400)
            .json({ success: false, errorMessage: "otp expired" });
        } else {
          if (userVerify.OTP === otp) {
            success = true;
            await UserVerify.deleteOne({ email: email });
            const user = await User.findOneAndUpdate(
              { email: email },
              { verified: true }
            );
            const data = {
              user: {
                id: user._id,
              },
            };

            const authtoken = jwt.sign(data, JWT_SECRET);
            return res.json({
              success: true,
              message: "user verified",
              authtoken,
            });
          } else {
            return res
              .status(400)
              .json({ success: false, errorMessage: "otp not matched" });
          }
        }
      }
    } catch (errors) {
      console.log({ errors });
      res
        .status(500)
        .json({ success: false, errorMessage: "internal Server Error" });
    }
  }
);

/* ---------------------------- Resend Otp route ---------------------------- */
authRouter.put("/resendotp", async (req, res) => {
  try {
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    await UserVerify.findOneAndUpdate(
      { email: req.body.email },
      { OTP: otp, createdAt: present, expireAt: endtime }
    );

    let mailOptions = {
      from: process.env.AUTH_USER,
      to: req.body.email,
      subject: "verification code",
      text: otp,
    };
    transporter.sendMail(mailOptions, function (errors, data) {
      if (errors) {
        console.log("Errors " + errors);
        res.json({ success: false, message: "server error" });
      } else {
        res.json({ success: true, message: "otp send successfully" });
        console.log("Email sent successfully");
      }
    });
  } catch (errors) {
    console.log({ errors });
    res
      .status(500)
      .json({ success: false, errorMessage: "internal Server Error" });
  }
});

/* ------------------------------- Login route ------------------------------ */
authRouter.post(
  "/login",
  [
    body("email", "Enter a valid email").not().isEmpty().isEmail(),
    body("password", "Enter a Strong Password")
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //change letter
      return res
        .status(500)
        .json({ success: false, errorMessage: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email }).populate("box");
      if (!user) {
        return res
          .status(400)
          .json({ success: false, errorMessage: "user not found" });
      }
      const passwordCompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          errorMessage: "please login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user._id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success: success, authtoken: authtoken, email: user?.email });
    } catch (errors) {
      console.log({ errors });
      res
        .status(500)
        .json({ success: false, errorMessage: "internal Server Error" });
    }
  }
);

authRouter.get("/userData", fetchIds, async (req, res) => {
  const { id } = req?.user?.user;
  try {
    let user = await User.findOne({ _id: id })
      .select("-password")
      .populate({
        path: "box",
        populate: {
          path: "items",
          populate: {
            path: "item",
          },
        },
      })
      .populate({
        path: "userData",
        populate: [
          {
            path: "address",
          },
          {
            path: "defaultAddress",
          },
        ],
      });

    if (user) {
      return res.status(200).json({
        success: true,
        user,
      });
    } else {
      return res
        .status(401)
        .json({ success: false, errorMessage: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, errorMessage: "Internal Server Error" });
  }
});

module.exports = authRouter;
