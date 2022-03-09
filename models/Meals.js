const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealSchema = new Schema({
    title: String,
    description: String,
    image: String,
});
const Meals = mongoose.model('Meals', mealSchema);

module.exports = Meals;
