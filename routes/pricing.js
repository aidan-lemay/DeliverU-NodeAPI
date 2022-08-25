const https = require('https');
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();
const { Orders, Locations, Clocked } = require('../model/model');

const router = express.Router();
const projection = {locationCode: 0, requestTime: 0, orderComplete: 0, customerName: 0, customerPhone: 0, customerInstructions: 0, dasherAssigned: 0, dasherID: 0, acceptTime: 0, completeTime: 0, __v: 0};

let src = null;
let gDin = null;
let gDist = null;

// Data Validation Functions
async function checkLocation(locCode) {
    let loc = await Locations.find({"locationCode": locCode}, {_id: 0});

    if (loc[0] == undefined) {
        return Promise.resolve(false);
    }
    else {
        src = loc[0]['mainAddress'];
        return Promise.resolve(true);
    }
}

async function checkDinAddress(dinAddr) {
    gDin = dinAddr;
    let query = "https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&origins=" + dinAddr + "&destinations=" + src + "&key=" + process.env.MAPS_API;

    return new Promise(function (resolve, reject) {
        axios.get(query).then(
            (response) => {
                let result = response.data.rows[0].elements[0].distance.text;
                const distance = result.split(" ");

                if (distance[0] > 10.0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            },
                (error) => {
                reject(error);
            }
        );
    });
}

async function checkDelAddress(delAddr) {
    let query = "https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&origins=" + gDin + "&destinations=" + delAddr + "&key=" + process.env.MAPS_API;

    return new Promise(function (resolve, reject) {
        axios.get(query).then(
            (response) => {
                let result = response.data.rows[0].elements[0].distance.text;
                const distance = result.split(" ");
                gDist = distance[0];

                if (distance[0] > 20000.0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            },
                (error) => {
                reject(error);
            }
        );
    });
}

async function costCalculate() {
    const time = new Date;
    const volume = await Orders.find({"orderComplete": false}).count(); // Number of Unfufilled Orders
    const online = await Clocked.find({"clockedIn": true}).count(); // Number of Dashers

    let basePrice = 6.00 + Math.random() * (0.01 - 0.50) + 0.01;

    if (gDist < 800) { // Less than 1/2 Mile
        return Promise.resolve(basePrice);
    }
    else if (gDist > 800 && gDist < 1600) { // Greater than 1/2 Mile but less than 1 Mile
        return Promise.resolve(basePrice + 1.25);
    }
    else if (gDist > 1600 && gDist < 2400) { // Greater than 1 Mile but less than 1.5 Mile
        return Promise.resolve(basePrice + 2.50);
    }
    else if (gDist > 2400 && gDist < 3200) { // Greater than 1.5 Mile but less than 2 Mile
        return Promise.resolve(basePrice + 3.75);
    }
    else if (gDist > 3200 && gDist < 8000) {
        return Promise.resolve(basePrice + 5.00);
    }

}

router.post('/', async (req, res) => {
    let locR;
    let dinR;
    let delR;

    await checkLocation(req.body.locationCode).then(
        function(value) {locR = value},
        function(error) {locR = error}
    );
    await checkDinAddress(req.body.diningAddress).then(
        function(value) {dinR = value},
        function(error) {dinR = error}
    );
    await checkDelAddress(req.body.deliveryAddress).then(
        function(value) {delR = value},
        function(error) {delR = error}
    );

    // Data Validation
    if (!(locR)) {
        res.status(400).json({"error": "Error in locationCode, please check your input"});
    }
    else if (!(dinR)) {
        res.status(400).json({"error": "Error in diningAddress, please check your input"});
    }
    else if (!(delR)) {
        res.status(400).json({"error": "Error in deliveryAddress, please check your input"});
    }
    else {
        let cost = 5;
        await costCalculate().then(
            function(value) {cost = value}
        );

        const data = new Orders({
            locationCode: req.body.locationCode,
            deliveryAddress: req.body.deliveryAddress,
            diningAddress: req.body.diningAddress,
            orderCost: cost,
            requestTime: Date.now()
        });
    
        try {
            const dta = await data.save();
            const dataToSave = await Orders.findOne({"_id": dta._id}, projection);
            res.status(200).json({"id": dataToSave._id, "diningAddress": dataToSave.diningAddress, "deliveryAddress": dataToSave.deliveryAddress, "orderCost": dataToSave.orderCost})
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }
});

module.exports = router;
