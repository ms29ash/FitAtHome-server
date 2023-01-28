const mongoose = require('mongoose')
const { Schema } = mongoose

const addressSchema = new Schema({
    address: { type: String },
})



addressSchema.index({ _id: 1 }, { sparse: true });

module.exports = addressSchema;