const mongoose = require("mongoose");
const { Box } = require("./Box");
const UserData = require("./UserData");
const Address = require("./Address");
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

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      let box = await Box.create({ user: this._id });
      let userData = await UserData.create({ user: this._id });
      this.box = box._id;
      this.userData = userData._id;
    } catch (error) {
      console.log(error);
    }
  }
  next();
});

const User = model("Users", UserSchema);

module.exports = User;
