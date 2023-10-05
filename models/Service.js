const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
    title: String,
    description: String,
    image: String,
    color: String,
});
const Service = mongoose.model('service', serviceSchema);

module.exports = Service;
