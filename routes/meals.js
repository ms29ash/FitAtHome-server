const express = require('express');
const router = express.Router();
//Import Melas Model
const Meals = require('../models/Meals')

router.get('/', async (req, res, next) => {
    try {
        let meals = await Meals.find({});
        res.json({ meals });
    } catch (error) {
        console.log(error)
    }

});


module.exports = router;