const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = mongoose.Schema({
  type: { type: String, enum: ["Food", "Product"], required: true },
  quantity: {
    type: Number,
    required: true,
  },
  item: {
    type: mongoose.Types.ObjectId,
    refPath: "type",
  },
});

const boxSchema = new Schema({
  items: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Item" }],
    default: [],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Item = mongoose.model("Item", itemSchema);
const Box = mongoose.model("Box", boxSchema);

module.exports = { Item, Box };
