require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoString = process.env.DATABASE_URL;

// Routes
const pricing = require('./routes/pricing');
const order = require('./routes/order');

app.use(express.json());

// DB Scripts
mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

// Methods
app.use('/pricing', pricing);
app.use('/order', order);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})