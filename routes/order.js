const express = require('express');
const router = express.Router();
const { Orders, Locations, Clocked } = require('../model/model');
require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
let ObjectId = require("bson-objectid");

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const channels = {
    2760: {
        "order-logging": "1011310921781612664", // ID of PRIVATE #order-logging
        "control-channel": "1011310943935942696", // ID of PRIVATE #bot-control
    },
    5816: {
        "order-logging": "1010554530976514110", // ID of PRIVATE #order-logging
        "control-channel": "1010554597548490773", // ID of PRIVATE #bot-control
    }
};

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    for (let l in channels) {
        const Channel = client.channels.cache.get(channels[l]['control-channel']);
        if (!Channel) return console.log("Invalid channel.");

        Channel.send("DeliverU Dispatch is Online!");
    };
    
});

async function runDispatch(id, locationCode) {

    let orders = channels[locationCode]['order-logging']

    const order = await Orders.findOne({"_id": ObjectId(id)});
    if (order != undefined) {
        const Channel = client.channels.cache.get(orders);
        if (!Channel) return console.log("Invalid channel.");
        Channel.send(id + " | " + Date.now());
    }
    
}

router.post('/', async (req, res) => {
    const id = req.body.id;
    const updatedData = req.body.data;

    // ERROR CHECKING!!!!!
    const order = await Orders.findOne({_id: ObjectId(id)});

    if (order == undefined) {
        res.status(500).json({error: "Supplied ID was not found in the database"});
    }
    else {
        Orders.updateOne({ "_id": id }, updatedData, function (err, result) {
            if (err !== null) {
                res.status(500).json(err);
            }
            else {
                res.status(200).json({"id": id, "orderAccepted": "True"});
                runDispatch(id, order.locationCode);
            }
        });
    }

    
});

module.exports = router;
client.login(process.env.CLIENT_TOKEN);