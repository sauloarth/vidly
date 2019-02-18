const mongoose = require('mongoose');


const schema = mongoose.Schema({
    name:{ 
            type: String, 
            required: true,
            minlength: 3,
            maxlength: 50
        }
});


function validate(genre) {
    // Joi schema accessible by all functions
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);
}

module.exports.Genre = mongoose.model('Genre', schema);
module.exports.genreSchema = schema;
module.exports.validate = validate;