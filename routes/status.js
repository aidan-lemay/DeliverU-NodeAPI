const express = require('express');
const router = express.Router();
const { Orders } = require('../model/model');
require('dotenv').config(); //initialize dotenv

router.get('/', async (req, res) => {
    const order = await Orders.findOne({"_id": req.body.id});
    res.status(200).json({"orderID": order._id, "dasherAssigned": order.dasherAssigned, "acceptTime": order.acceptTime, "orderComplete": order.orderComplete, "completeTime": order.completeTime});
});

module.exports = router;