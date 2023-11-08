const mongoose = require("mongoose");

const userDataSchema = mongoose.Schema({
  address: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  defaultAddress: {
    type: mongoose.Types.ObjectId,
    ref: "Address",
  },
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
