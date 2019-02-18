const express = require('express');
const routes = express.Router();
const { User } = require('../models/user');
const { validate } = require('../models/user');

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    const result = await user.save();

    if(result) return res.send(`User ${result.name} registred.`);

    return res.status(404).send('User could not be registred.');
})

module.exports = routes;