const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema({
  title: {
    type: String,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

addressSchema.pre("save", function (next) {
  if (this.isNew && !this.title) {
    this.title = this.street;
  }
  next();
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
