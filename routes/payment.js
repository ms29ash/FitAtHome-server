const Razorpay = require('razorpay');
const express = require('express');
const Order = require('../models/Order.js');
const paymentRouter = express.Router();
require('dotenv').config()

var instance = new Razorpay(
    {
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    }
)

paymentRouter.get('/get-rzrpay-key', (req, res) => {
    res.status(200).send({ key: process.env.KEY_ID });
})

paymentRouter.post('/create-order', async (req, res) => {
    try {

        const options = {
            amount: parseInt(req.body.amount),
            currency: 'INR'
        }
        const order = await instance.orders.create(options);
        if (!order) {
            return res.status(500).send('Some Error Occured');
        }
        res.send(order);
    } catch (error) {
        console.log(error);
        res.status(500).send(`${error.message} create order`);
        console.log(error.message)
    }
})

paymentRouter.post('/pay-order', async (req, res) => {
    try {
        const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

        const newOrder = Order({
            isPaid: true,
            amount: amount,
            razorpay: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            }
        })
        await newOrder.save();
        res.send({
            msg: 'Payment was Successful'
        })

    } catch (error) {
        res.status(500).send(error.message)
        console.log(error.message)
    }
})

module.exports = paymentRouter;