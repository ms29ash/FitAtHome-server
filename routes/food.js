const express = require('express');
const router = express.Router();
//Import food Model
const Food = require('../models/Food')
/* GET home page. */

router.get('/', async (req, res, next) => {
  try {
    let food = await Food.find();
    res.json({ food });
  } catch (error) {
    console.log(error)
  }

});
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    let food = await Food.find({ _id: id });
    res.json({ food });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;
