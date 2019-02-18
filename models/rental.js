const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    outDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    returnDate: {
        type: Date
    },
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            }
        }),
        required: true
    },
    movie:{
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});


function validate(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(rental, schema);
}


module.exports.Rental = mongoose.model('Rental', schema);
module.exports.schemaRental = schema;
module.exports.validate = validate;