const express = require('express');
const routes = express.Router();
const Costumer = require('../models/customer');
const Joi = require('joi');
const db = require('debug')('vidly:costumersRoutes');

routes.get('/', async (req, res) => {
    const results = await Costumer.find();   
    res.send(results);
    db(results);
})

routes.post('/', async(req, res) => {
    const { error } = validateCostumer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const costumer = new Costumer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    const result = await costumer.save();
    if(result) 
        return res.send(`Costumer ${result.name} saved with success.`); 
    else
        return res.status(404).send('Costumer could not be saved.');

})

function validateCostumer (costumer) {
    const schema = {
        name: Joi.string().required().min(3).max(120),
        isGold: Joi.boolean(),
        phone: Joi.string()
    }

    return Joi.validate(costumer, schema);
}

module.exports = routes;