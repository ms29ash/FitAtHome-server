const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    review: String,
    Date: Date,
});
const Review = mongoose.model('Review', foodSchema);

module.exports = Review;
