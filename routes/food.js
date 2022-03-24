const express = require('express');
const router = express.Router();
//Import food Model
const Food = require('../models/Food')
const Meals = require('../models/Meals')
const Reviews = require('../models/Reviews')

/* GET home page. */
router.get('/food', async (req, res, next) => {
  let food = await Food.find({});
  res.json({ food: food });
});


router.get('/meals', async (req, res, next) => {
  let meals = await Meals.find({});
  res.json({ meals: meals });
});
router.get('/reviews', async (req, res, next) => {
  let reviews = await Reviews.find({});
  res.json({ reviews: reviews });
});


module.exports = router;
