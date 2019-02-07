const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 120,
    },
    phone: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Costumer', schema);