const express = require('express');
const Model = require('../model/model');
const router = express.Router();
const projection = {acceptableOrder: 0, locationCode: 0, requestTime: 0, orderComplete: 0, customerName: 0, customerPhone: 0, customerInstructions: 0, dasherAssigned: 0, acceptTime: 0, completeTime: 0, __v: 0};

//Get all Method
router.get('/', async (req, res) => {
    const data = new Model({
        locationCode: req.body.locationCode,
        deliveryAddress: req.body.deliveryAddress,
        diningAddress: req.body.diningAddress,
        // orderCost: cost.calculate(), COST CALC HERE
        requestTime: Date.now()
    });

    try {
        const dta = await data.save();
        const dataToSave = await Model.find({"_id": dta._id}, projection);
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

module.exports = router;