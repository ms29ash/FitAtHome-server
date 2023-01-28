const express = require('express');
const router = express.Router();

//user model
const User = require('../models/User.js');
const fetchIds = require('../middleware/verifyUser.js');

/* GET home page. */
router.put('/addAddress', fetchIds, async (req, res, next) => {
    try {
        let { id } = req.user?.user
        const user = await User.findOne({ _id: id })
        let update = user?.userData?.address.push({ address: req.body.address })
        const save = await user.save()
        return res.status(201).send({ success: true, message: `Address updated successfully`, item: user?.userData?.address[update - 1] })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, errorMessage: "Internal server error" })
    }
});


module.exports = router;