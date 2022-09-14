require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const mongoString = process.env.DATABASE_URL;

// Routes
const auth = require('./middleware/auth');
const login = require('./auth/login');
const register = require('./auth/register');
const reports = require('./routes/reports');
const pricing = require('./routes/pricing');
const getPrice = require('./routes/getPrice');
const order = require('./routes/order');
const status = require('./routes/status');

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
app.use('/login', login);
app.use('/register', register);
app.use('/reports', auth, reports)
app.use('/pricing', auth, pricing);
app.use('/getPrice', auth, getPrice);
app.use('/order', auth, order);
app.use('/status', auth, status);

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})