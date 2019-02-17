const mongoose = require('mongoose');
const { customerSchema } = require('./customer');
const { movieSchema } = require('./movie');

const schema = new mongoose.Schema({
    initDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    amountOfDays: {
        type: Number,
        default: 3,
        max: 10,
        min: 1
    },
    endDate: {
        type: Date
    },
    customer: {
        type: customerSchema,
        required: true
    },
    movie:{
        type: movieSchema,
        required: true
    }
});

module.exports.Rental = mongoose.model('Rental', schema);
module.exports.schemaRental = schema;