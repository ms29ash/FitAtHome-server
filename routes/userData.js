const express = require('express');
const router = express.Router();

//user model
const User = require('../models/User.js');
const fetchIds = require('../middleware/verifyUser.js');

/* GET home page. */
router.get('/', fetchIds, async (req, res, next) => {
    try {
        let id = req.user
        let user = await User.find({ _id: id });
        return res.status(200).send({ address: user.address })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: "Internal server error" })
    }
});


module.exports = router;