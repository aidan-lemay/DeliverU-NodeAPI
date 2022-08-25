const express = require('express');
const router = express.Router();
const { Orders } = require('../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

router.post('/', async (req, res) => {
    const order = await Orders.findOne({"_id": ObjectId(req.body.id)});
    res.status(200).json({"orderID": order._id, "runnerAssigned": order.dasherAssigned, "acceptTime": order.acceptTime, "orderComplete": order.orderComplete, "completeTime": order.completeTime});
});

module.exports = router;