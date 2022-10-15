const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    isPaid: Boolean,
    amount: Number,
    razorpay: {
        orderId: String,
        paymentId: String,
        signature: String,
    },
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order;