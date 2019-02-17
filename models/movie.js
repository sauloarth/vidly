const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const schema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 100,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})

module.exports.Movie = mongoose.model('Movie', schema);
module.exports.movieSchema = schema;