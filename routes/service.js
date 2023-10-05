const express = require('express');
const router = express.Router();

const Service = require('../models/Service.js')

router.get('/', async (req, res, next) => {
    try {
        let services = await Service.find({});
        res.status(200).send({ services });
    } catch (error) {
        console.log(error)
    }

});


module.exports = router;