const express = require('express');
const router = express.Router();
const { Orders, Locations, Clocked } = require('../model/model');
require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js
const { Intents } = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const guild = "979541976938598410";
const control = "984459945900662784";
const orders = "984464477019844639";
const clockedin = "984463229466075136";

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

    Channel.send("<@&" + clockedin + "> A New Order Has Been Submitted!\nFROM: " + order.diningAddress + "\nTO: " + order.deliveryAddress + "\nReact with :white_check_mark: to claim!")
    .then(function (message) {
        message.react("✅")
    }).catch(function() {
        //Something
    });
}

client.on('messageReactionAdd', (reaction, user) => {
    if(reaction.emoji.name === "white_checK_mark") {
        console.log(reaction.users);
        console.log(user);
    }
});

router.post('/', async (req, res) => {
    const id = req.query.id;
    const updatedData = req.body;

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