const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    locationCode: {
        required: true,
        type: Number
    },
    diningAddress: {
        required: true,
        type: String
    },
    deliveryAddress: {
        required: true,
        type: String
    },
    roomNumber: {
        required: false,
        type: String,
        default: ""
    },
    orderCost: {
        required: false,
        type: Number,
        default: 0
    },
    requestTime: {
        required: true,
        type: Date
    },
    orderComplete: {
        required: false,
        type: Boolean,
        default: false
    },
    customerName: {
        required: false,
        type: String,
        default: null
    },
    customerPhone: {
        required: false,
        type: Number,
        default: null
    },
    customerInstructions: {
        required: false,
        type: String,
        default: null
    },
    dasherAssigned: {
        required: false,
        type: Boolean,
        default: false
    },
    dasherID: {
        required: false,
        type: Number,
        default: null
    },
    acceptTime: {
        required: false,
        type: Date,
        default: null
    },
    completeTime: {
        required: false,
        type: Date,
        default: null
    }

})

const locationSchema = new mongoose.Schema({
    locationName: {
        required: true,
        type: String
    },
    locationCode: {
        required: true,
        type: Number
    },
    mainAddress: {
        required: true,
        type: String
    }
})

const clockedSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: Number
    },
    user_name: {
        required: true,
        type: String
    },
    user_discriminator: {
        required: true,
        type: String
    },
    clockedIn: {
        required: true,
        type: Boolean
    },
    in_time: {
        required: true,
        type: Date
    },
    out_time: {
        required: true,
        type: Date
    }

})

const Orders = mongoose.model('orders', orderSchema)
const Locations = mongoose.model('locationCodes', locationSchema)
const Clocked = mongoose.model('clockedIn', clockedSchema)

module.exports = {Orders, Locations, Clocked}