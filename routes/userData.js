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

        user.userData.address = req.body.address
        await user.save()

        return res.status(201).json({ success: true, message: 'Address updated successfully' })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, errorMessage: "Internal server error" })
    }
});


module.exports = router;