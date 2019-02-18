const mongoose = require('mongoose');
const Joi = require('joi');

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

function validate (customer) {
    const schema = {
        name: Joi.string().required().min(3).max(120),
        isGold: Joi.boolean(),
        phone: Joi.string()
    }

    return Joi.validate(customer, schema);
}

module.exports.Customer = mongoose.model('Customer', schema);
module.exports.customerSchema = schema
module.exports.validate = validate;