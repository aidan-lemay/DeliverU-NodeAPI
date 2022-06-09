const express = require('express');
const router = express.Router();
const { Orders, Locations, Clocked } = require('../model/model');

router.post('/', async (req, res) => {
    const id = req.query.id;
    const updatedData = req.body;

    Orders.updateOne({"_id": id}, updatedData, function(err, result){
        if (err !== null) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(result);
        }
    })
});

module.exports = router;