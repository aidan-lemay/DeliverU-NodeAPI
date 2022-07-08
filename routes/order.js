const express = require('express');
const router = express.Router();
const { Orders, Locations, Clocked } = require('../model/model');
require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
const { Intents } = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const control = "984459945900662784";
const orders = "993327814482874479";

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const Channel = client.channels.cache.get(control);
    if (!Channel) return console.log("Invalid channel.");

    Channel.send("DeliverU Dispatch is Online!");
});

async function runDispatch(id) {

    const order = await Orders.findOne({"_id": id});

    const Channel = client.channels.cache.get(orders);
    if (!Channel) return console.log("Invalid channel.");
    Channel.send(id + " | " + Date.now());
}

// Idea: Attach 'id' to the first line of the message
// Have control listen for reactions, then dispatch accordingly

router.post('/', async (req, res) => {
    const id = req.body.id;
    const updatedData = req.body;

    // ERROR CHECKING!!!!!

    Orders.updateOne({ "_id": id }, updatedData, function (err, result) {
        if (err !== null) {
            res.status(500).json(err);
        }
        else {
            res.status(200).json(result);
            runDispatch(id);
        }
    });
});

module.exports = router;
client.login(process.env.CLIENT_TOKEN);