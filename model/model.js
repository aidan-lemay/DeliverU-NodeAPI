const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    locationCode: {
        required: true,
        type: Number
    },
    diningAddress: {
        required: true,
        type: String
    },
    orderCost: {
        required: false,
        type: Number,
        default: 0
    },
    acceptableOrder: {
        required: false,
        type: Boolean,
        default: false
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

module.exports = mongoose.model('Orders', dataSchema)