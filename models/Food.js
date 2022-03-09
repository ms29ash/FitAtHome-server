const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    type: String,
    description: String,
    image: String,
    price: Number,
});
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
