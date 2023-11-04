const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  userData: {
    type: mongoose.Types.ObjectId,
    ref: "UserData",
  },
  box: {
    type: mongoose.Types.ObjectId,
    ref: "Box",
  },
});

const User = model("Users", UserSchema);

module.exports = User;
