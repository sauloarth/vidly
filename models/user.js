const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const schema = new mongoose.Schema({
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
        maxlength: 1024
    },
    isAdmin: Boolean
})

schema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

function validate(user) {
    const schema = {
        name: Joi.string().required().min(3).max(255),
        email: Joi.string().required().min(3).max(255).email(),
        password: Joi.string().required().min(6).max(100)
    }

    return Joi.validate(user, schema);
}

module.exports.User = mongoose.model('User', schema);
module.exports.validate = validate;