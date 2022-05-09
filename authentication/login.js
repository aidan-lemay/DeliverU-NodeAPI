const express = require('express');
const router = express.Router();
const db = require('../api/db');
const url = require('url');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
require("dotenv").config();

router.post('/login', async function (req, res) {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).json({
                "error": "All Input Fields are Required"
              });
        }
        // Validate if user exist in our database
        var user;
        findOne(email, function (err, result) {
            if (err) {
                console.log(err);
            }
            user = result[0];

            bcrypt.compare(password, user.password).then(match => {      
                if (match) {
                    // Create token
                    const token = jwt.sign(
                        { user_id: user._id, email },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "24h",
                        }
                    );

                    addToken(user.user_id, token, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });

                    // User
                    res.status(200).json({
                        "user_id": user.user_id,
                        "name": user.first_name + " " + user.last_name,
                        "email": user.email,
                        "session_token": token
                    });

                    // Log to console when user logs in
                    console.log("User " + user.email + " logged in");          
                } else {
                    // If matching credentials were not found, return code 404 (wrong credentials) to the client
                    res.status(401).json({
                        "error": "Email or Password Not Found"
                      });          
                }
            })
            .catch(error => {
                res.status(500).send();
                console.log(error);
            })

            // if (user && (bcrypt.compare(password, user.password))) {
            //     // Create token
            //     const token = jwt.sign(
            //         { user_id: user._id, email },
            //         process.env.TOKEN_KEY,
            //         {
            //             expiresIn: "24h",
            //         }
            //     );
            //     // user
            //     res.status(201).json({
            //         "user_id": user.user_id,
            //         "user_name": user.first_name + " " + user.last_name,
            //         "email": user.email,
            //         "session_token": user.session_token
            //     });
            // }
            // else {
            //     res.status(400).send("Invalid Credentials");
            // }


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