const express = require('express');
const router = express.Router();

const Category = require('../models/Category.js')

router.get('/', async (req, res, next) => {
    try {
        let categories = await Category.find({});
        res.status(200).send({ categories });
    } catch (error) {
        console.log(error)
    }

});


module.exports = router;