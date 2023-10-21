const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let Products = await Product.find();
    return res.json(Products);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  console.log("try");
  try {
    const id = req.params.id;
    console.log(id);
    let Products = await Product.findOne({ _id: id });
    return res.json(Products);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
