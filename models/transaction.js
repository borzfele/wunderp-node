const mongoose = require('mongoose');

const {User} = require('./user');

let Transaction = mongoose.model('Transaction', {

    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    issue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    }
});

module.exports = {Transaction};