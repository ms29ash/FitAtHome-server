const express = require("express");
const router = express.Router();

//user model
const User = require("../models/User.js");
const fetchIds = require("../middleware/verifyUser.js");
const Address = require("../models/Address.js");
const UserData = require("../models/UserData.js");

/* Fetch Address */
// GET /userData/address/fetchAll
router.get("/fetchAll", fetchIds, async (req, res) => {
  try {
    let userData = await UserData.findOne({ user: req.user.user.id })
      .populate("defaultAddress")
      .populate("address");
    console.log(userData);
    res.json({
      addresses: userData.address,
      defaultAddress: userData.defaultAddress,
    });
  } catch (error) {
    console.log(error);
  }
});

/* Add Address */
// POSt /userData/address/add
router.post("/add", fetchIds, async (req, res, next) => {
  try {
    let { address } = req.body;
    let { id } = req.user?.user;
    const user = await UserData.findOne({ user: id });

    let newAdd = await Address.create({
      ...address,
      user: id,
    });

    await user.address.push(newAdd._id);
    if (!user.defaultAddress) {
      user.defaultAddress = newAdd._id;
    }
    await user.save();
    return res.status(201).send({
      success: true,
      message: `Address created successfully`,
      address: newAdd,
      defaultAddress: user.defaultAddress,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, errorMessage: "Internal server error" });
  }
});

/* Remove Address */
// DELETE /userData/address/remove
router.delete("/remove/:id", fetchIds, async (req, res) => {
  try {
    let address = await Address.findOneAndDelete({ _id: req.params?.id });
    await UserData.findOneAndUpdate(
      { user: req.user.user.id },
      {
        $pull: {
          address: req.params?.id,
        },
      },
      { new: true }
    );
    res.json({ address: address._id });
  } catch (error) {
    console.log(error);
  }
});

//Update Address
// PUT /userData/address/update
router.put("/update", fetchIds, async (req, res) => {
  try {
    let address = await Address.findOneAndUpdate(
      { _id: req.body.address },
      { $set: req.body.update },
      { new: true }
    );
    res.json(address);
  } catch (error) {
    console.log(error);
  }
});

/* Set Address Default */
// PUT /userData/address/setDefault
router.put("/setDefault", fetchIds, async (req, res) => {
  try {
    let user = await UserData.findOne({ user: req.user.user.id });
    user.defaultAddress = req.body.defaultAddress;
    await user.save();
    let defaultAddress = await Address.findOne({
      _id: req.body.defaultAddress,
    });
    res.json(defaultAddress);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
