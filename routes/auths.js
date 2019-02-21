const bcrypt = require('bcryptjs');
const Joi = require('joi');
const express = require('express');
const routes = express.Router();
const { User } = require('../models/user');
const _ = require('lodash');

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();

    const passwordValidation = await bcrypt.compare(req.body.password, user.password);
    if(!passwordValidation) return res.status(400).send('Invalid email or password.');

    res.send(token);
})

function validate(user) {
    const schema = {
        email: Joi.string().required().min(3).max(255).email(),
        password: Joi.string().required().min(6).max(100)
    }

    return Joi.validate(user, schema);
}

module.exports = routes;