const mongoose = require('mongoose');


const schema = mongoose.Schema({
    name:{ 
            type: String, 
            required: true,
            minlength: 3,
            maxlength: 50
        }
});

module.exports.Genre = mongoose.model('Genre', schema);
module.exports.genreSchema = schema;