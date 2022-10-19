const { startOfWeek, endOfWeek, previousSaturday, previousSunday, format } = require('date-fns');
const express = require('express');
const router = express.Router();
const { Orders, Locations, Runners } = require('../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

router.post('/', async (req, res) => {

    const date = new Date();
    const start = previousSunday(startOfWeek(date));
    const end = previousSaturday(endOfWeek(date));
    const startDate = format(previousSunday(startOfWeek(date)), 'MMMM dd, yyyy');
    const endDate = format(previousSaturday(endOfWeek(date)), 'MMMM dd, yyyy');

    let output = {
        recordStart: startDate,
        recordEnd: endDate
    };

    let cnt = 1;

    for await (const doc of Runners.find()) {
        let completeCount = 0;
        let incompleteCount = 0;
        for await (const rec of Orders.find({'dasherID': doc.user_id})) {

            const recDate = new Date(rec.completeTime);

            if (recDate < end && recDate > start) {
                if (rec.orderComplete) {
                    completeCount ++;
                }
                else if (!rec.orderComplete) {
                    incompleteCount ++;
                }
            }
        }
        let usrObj = {
            userName: doc.user_firstname + " " + doc.user_lastname,
            location: doc.user_locationcode,
            orders: {
                complete: completeCount,
                incomplete: incompleteCount
            }
        }
        output[cnt] = usrObj;
        cnt ++;
    }

    res.status(200).json(output);

    // Get Orders for Each User
    // const order = await Orders.findOne({"_id": ObjectId(req.body.id)});
});

module.exports = router;