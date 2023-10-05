const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    title: String,
    description: String,
    image: String,
    icon: String,
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
