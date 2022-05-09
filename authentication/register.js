const express = require('express');
const router = express.Router();
const db = require('../api/db');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
require("dotenv").config();
const url = require('url');
var userID;

router.post('/register', async function (req, res) {
    // Our register logic starts here
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).json({
                "error": "All Input is Required"
              });
        }

        // check if user already exist
        // Validate if user exist in our database
        var oldUser;
        findOne(email, function (err, result) {
            if (err) {
                console.log(err);
            }
            oldUser = result;
        });

        if (oldUser) {
            res.status(409).json({
                "error": "User Already Exists - Please Login"
              });
        }

        //Encrypt user password
        const encryptedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function(err, hash) {
                if (err) reject(err)
                resolve(hash)
            });
        });
        console.log(encryptedPassword);

        // Create user in our database
        create(first_name, last_name, email.toLowerCase(), encryptedPassword, function (err, result) {
            if (err) {
                console.log(err);
            }
            userID = result.insertId;

            // Create token
            const token = jwt.sign(
                { user_id: userID, email },
                    process.env.TOKEN_KEY,
                {
                    expiresIn: "24h",
                }
            );

            // save user token
            addToken(userID, token, function (err, result) {
                if (err) {
                    console.log(err);
                }
                res.status(201).json({
                    "userID": userID,
                    "userToken": token
                });
            });
        });        
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

function findOne(email, callback) {
    var sql = 'SELECT * FROM user WHERE email = "' + email + '";';

    db.conn.query(sql, function (err, rows, fields) {
        if (!err) {
            if (rows) {
                callback(null, rows);
            }
        } else {
            callback(err, null);
            console.log('Error while performing Query.');
        }
    });
}

function create(first_name, last_name, email, encryptedPassword, callback) {
    
    let sql = 'INSERT INTO user (first_name, last_name, email, password) VALUES ("' + first_name + '", "' + last_name + '", "' + email + '", "' + encryptedPassword + '");';

    db.conn.query(sql, [ first_name, last_name, email, encryptedPassword ], function (err, rows, fields) {
        if (!err) {
            if (rows) {
                callback(null, rows);
            }
        } else {
            callback(err, null);
            console.log('Error while performing Query.');
        }
    });
}

function addToken(uid, session_token, callback) {
    let sql = "UPDATE user SET session_token = '" + session_token + "' WHERE user_id = " + uid + ";";

    db.conn.query(sql, function (err, rows, fields) {
        if (!err) {
            if (rows) {
                callback(null, rows);
            }
        } else {
            callback(err, null);
            console.log('Error while performing Query.');
        }
    });
}

module.exports = router;