const bcrypt = require('bcryptjs');
const express = require('express');
const routes = express.Router();
const auth = require('../middlewares/auth');
const { User } = require('../models/user');
const { validate } = require('../models/user');
const _ = require('lodash');

routes.get('/me', auth, async (req, res) => {
    const user = await User.findOne({_id: req.user._id}).select('-password');
    res.send(user);
})

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const email = await User.findOne({email: req.body.email});
    if(email) return res.status(400).send('User already registered.');

    const user = new User(_.pick( req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = routes;