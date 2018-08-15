const mongoose = require('mongoose');

let Issue = mongoose.model('Issue', {
    text: {
        type: Number,
        required: true
    }
});

module.exports = {Issue};