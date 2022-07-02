const express = require("express");
//bcrypt for password hashing
const bcrypt = require('bcrypt')
//json web token auth
const jwt = require('jsonwebtoken')
//user model
const User = require('../Models/User.js')
//dotenv (env variables)
require('dotenv/config')
//Verify otp schema
const UserVerify = require('../Models/UserVerification.js')
//express validator validating req body
const { body, validationResult } = require('express-validator');

//two step auth validation
const nodemailer = require('nodemailer')


//otp generator
const otpGenerator = require('otp-generator');

//moment for time format 
const moment = require('moment')

//create express router
const authRouter = express.Router();
//salt rounds for password hashing
const saltRounds = 10;
//secret for jwt token
const JWT_SECRET = process.env.JWT_SECRET
//moment time
const present = moment().utc('+05:30');
const endtime = moment().add(15, 'm').utc('+05:30')

//nodemailer stuff 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 2525,
    // secure: false,
    auth: {
        host: "smtp.gmail.com",
        type: 'OAuth2',
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
        clientId: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        refreshToken: process.env.AUTH_REFRESH_TOKEN,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

let success = false;



//Route:1 Signup Route
authRouter.post('/signup',
    //Validation using express validator
    [
        body('name', "Enter your Name").not().isEmpty().isLength({ min: 2 }),
        body("email", 'Enter a valid email').not().isEmpty().isEmail(),
        body("password", "Enter a Strong Password").not().isEmpty().isLength({ min: 6 })
    ],
    async (req, res) => {

        //validation Errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //change letter
            return res.status(500).json({ success: false, errors: errors.array() });
        }
        try {
            //create new user
            let user = await User.findOne({ email: req.body.email });
            //finding user in database 
            if (user) {
                return res.status(200).json({ success: false, error: "Sorry the user already exists" })
            }
            //generating salt 
            const salt = await bcrypt.genSalt(saltRounds)
            //hashing password
            const securePassword = await bcrypt.hash(req.body.password, salt)

            //Creating user and saving in database
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: securePassword,

            })
            let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });


            let OtpVerify = {
                email: req.body.email,
                OTP: otp
            }
            await UserVerify.create(OtpVerify);


            //mail options
            let mailOptions = {
                from: process.env.AUTH_USER,
                to: req.body.email,
                subject: "verification code",
                "text": OtpVerify.OTP,
            }


            //send email
            transporter.sendMail(mailOptions, (err, data) => {
                if (errors) {
                    console.log("Errors " + errors);
                } else {
                    console.log("Email sent successfully");
                }
            });
            success = true;
            res.json({ success: success, user: user, userId: OtpVerify.email })

        } catch (errors) {
            console.log(errors.message);
            res.status(500).json({ success: true, errors: "internal server error" })
        }
    })




authRouter.post('/verify',
    [
        body("email", 'Enter a valid email').not().isEmpty().isEmail(),
        body("otp", "Enter right otp").not().isEmpty().isLength({ min: 4, max: 4 })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //change letter
            return res.status(500).json({ success: false, errors: errors.array() });
        }

        try {



            let { email, otp } = req.body;
            let success = false;

            let userVerify = await UserVerify.findOne({ email: email })
            if (!userVerify) {
                return res.json({ success: false, error: "User not found" })
            } else {
                if (userVerify.expireAt < present) {

                    await UserVerify.deleteOne({ email: email })

                    return res.json({ success: false, message: "otp expired" })
                } else {
                    if (userVerify.OTP === otp) {
                        success = true;
                        await UserVerify.deleteOne({ email: email })
                        await User.findOneAndUpdate({ email: email }, { verified: true });
                        return res.json({ success: true, message: "user verified" })
                    } else {
                        return res.json({ success: false, message: "otp not matched" })
                    }
                }
            }
        } catch (errors) {
            console.log({ errors })
            res.status(500).json({ success: false, errors: "internal Server Error" })
        }
    })



authRouter.put('/resendotp', async (req, res) => {
    try {
        let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        await UserVerify.findOneAndUpdate({ email: req.body.email }, { OTP: otp, createdAt: present, expireAt: endtime });

        let mailOptions = {
            from: process.env.AUTH_USER,
            to: req.body.email,
            subject: "verification code",
            "text": otp,
        }
        transporter.sendMail(mailOptions, function (err, data) {
            if (errors) {
                console.log("Errors " + errors);
            } else {
                console.log("Email sent successfully");
            }
        });
        res.json({ success: true, message: "otp send successfully" })
    } catch (errors) {
        console.log({ errors })
        res.status(500).json({ success: false, errors: "internal Server Error" })
    }
})


authRouter.post('/login', [
    body("email", 'Enter a valid email').not().isEmpty().isEmail(),
    body("password", "Enter a Strong Password").not().isEmpty().isLength({ min: 6 })
], async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //change letter
        return res.status(500).json({ success: false, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success: false, errors: 'please login with valid credentials' });
        }
        const passwordCompare = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, errors: 'please login with correct credentials' });
        }

        const data = {
            user: {
                id: user.id,
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (errors) {
        console.log({ errors })
        res.status(500).json({ success: true, errors: "internal Server Error" })
    }
})


module.exports = authRouter;