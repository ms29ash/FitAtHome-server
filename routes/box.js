const express = require("express");
const router = express.Router();
//Import food Model
const { Box, Item } = require("../models/Box");
const fetchIds = require("../middleware/verifyUser");
const Food = require("../models/Food");

router.get("/", fetchIds, async (req, res, next) => {
  try {
    let box = await Box.findOne({ user: req.user.id }).populate({
      path: "items",
      populate: {
        path: "item",
      },
    });

    res.json({ box });
  } catch (error) {
    console.log(error);
  }
});
router.post("/", async (req, res, next) => {
  try {
    let box = await Box.create({});
    res.json({ box });
  } catch (error) {
    console.log(error);
  }
});
// router.post("/:id", async (req, res, next) => {
//   try {
//     const id = req.params.id;

//     let food = await Box.findOne({ _id: id });
//     res.json({ food });
//   } catch (error) {
//     console.log(error);
//   }
// });

router.post("/addToBox", fetchIds, async (req, res) => {
  try {
    const { item, quantity, type } = req.body;
    let newItem = await Item.create({
      quantity: quantity,
      item: item,
      type: type,
    });
    const box = await Box.findOne({ user: req.user.id });
    box.items.push(newItem._id);
    let newBox = await box.save();
    await newBox.populate({
      path: "items",
      populate: {
        path: "item",
      },
    });
    res.json(newBox);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/removeFromBox/:itemId", fetchIds, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    //find the user's box
    let box = await Box.findOne({ user: req.user.id }).populate("items");
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    let index = box.items.findIndex((item) => item.item.toString() === itemId);
    if (index < 0) {
      console.log(box.items[0].item.toString());
      return res.status(404).json({ message: "Item not found" });
    }
    box.items.splice(0, 1);

    await Item.deleteOne({ item: itemId });

    const updatedBox = await box.save();
    await updatedBox.populate({
      path: "items",
      populate: {
        path: "item",
      },
    });
    res.json({ updatedBox });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/updateQuantity", fetchIds, (req, res) => {});

module.exports = router;
