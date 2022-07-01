const express = require('express');
const router = express.Router();
//Import food Model
const Food = require('../models/Food')
const Meals = require('../models/Meals')
const Reviews = require('../models/Reviews')

/* GET home page. */

router.get('/food', async (req, res, next) => {
  try {
    let food = await Food.find();
    res.json({ food });
  } catch (error) {
    console.log(error)
  }

});
router.get('/food/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    let food = await Food.find({ _id: id });
    res.json({ food });
  });


router.get('/meals', async (req, res, next) => {
  try {
    let meals = await Meals.find({});
    res.json({ meals });
  } catch (error) {
    console.log(error)
  }

});
router.get('/reviews', async (req, res, next) => {
  try {


    let reviews = await Reviews.find({});
    res.json({ reviews });
  } catch (error) {
    console.log(error)
  }
});


module.exports = router;
