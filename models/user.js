const mongoose = require('mongoose');
const Joi = require('joi');

const schema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        maxlength: 3,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100
    }
})

function validate(user) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.required(),
        password: Joi.string().required().min(6).max(100)
    }

    return Joi.validate(user, schema);
}

module.exports.User = mongoose.model('User', schema);
module.exports.validate = validate;