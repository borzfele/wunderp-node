const mongoose = require('mongoose');

const {User} = require('./user');

let Account = mongoose.model('Account', {

    openingCash: {
        type: Number,
        required: true
    },
    openingDate: {
        type: Date,
        required: false
    },
    opener: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    transactions: {
        type: Array,
        default: null
    },
    closingCash: {
        type: Number,
        required: false
    },
    closingDate: {
        type: Date,
        required: false
    },
    closer: {
        type: mongoose.Schema.Types.Mixed,
        required: false
    },
    cassaBalance: {
        type: Number,
        required: false
    },
    posBalance: {
        type: Number,
        required: false
    },
    totalBalance: {
        type: Number,
        required: false
    },
    comments: {
        type: Array,
        required: false
    }
});

module.exports = {Account};