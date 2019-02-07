const mongoose = require('mongoose');


const schema = mongoose.Schema({
    name:{ 
            type: String, 
            required: true,
            minlength: 3,
            maxlength: 50
        }
});

module.exports = mongoose.model('Genre', schema);