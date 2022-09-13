const express = require('express');
const router = express.Router();
const { User } = require('../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    // Our register logic starts here
    try {
        // Get user input
        const { application_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && application_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        let encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            application_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "24h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json({token: user.token});
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = router;