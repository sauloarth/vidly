const mongoose = require('mongoose');
const Joi = require('joi');

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

function validate(movie) {
    const schema = {
        title: Joi.string().required().min(3).max(100),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required().min(0),
        dailyRentalRate: Joi.number().required().min(0)
    }

    return Joi.validate(movie, schema);
}

module.exports.Movie = mongoose.model('Movie', schema);
module.exports.movieSchema = schema;
module.exports.validate = validate;