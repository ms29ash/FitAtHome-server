const express = require('express');
const router = express.Router();
//Import food Model
const Reviews = require('../models/Reviews')

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        let reviews = await Reviews.find({});
        res.json({ reviews: reviews });
    } catch (error) {
        console.log(error)
    }
});


module.exports = router;