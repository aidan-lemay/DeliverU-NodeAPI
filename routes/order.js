const express = require('express');
const Model = require('../model/model');
const router = express.Router();
const projection = {diningAddress: 0, orderCost: 0, locationCode: 0, requestTime: 0, orderComplete: 0, customerName: 0, customerPhone: 0, customerInstructions: 0, dasherAssigned: 0, acceptTime: 0, completeTime: 0, __v: 0};

router.post('/', async (req, res) => {
    try {
        const id = req.query.id;
        const updatedData = req.body;
        const options = { new: true };
        
        await Model.findByIdAndUpdate(
            id, updatedData, options
        );

        const result = await Model.find({"_id": req.query.id}, projection);

        res.status(200).json(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

module.exports = router;