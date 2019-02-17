const express = require('express');
const routes = express.Router();
const { Customer } = require('../models/customer');
const Joi = require('joi');
const db = require('debug')('vidly:costumersRoutes');

routes.get('/', async (req, res) => {
    const results = await Customer.find();   
    res.send(results);
    db(results);
})

routes.get('/:id', async (req, res) => {
    const result = await Costumer.findById(req.params.id);
    result ? res.send(result) : res.status(404).send('Costumer not found.');
    // TODO: it runs into an error when an id greater
    // or less than the regular id is passed.
})

routes.post('/', async (req, res) => {
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

routes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const { error } = validateCostumer(data);
    if(error) {
        //validation error
        return res.status(400).send(error.details[0].message);
    } 

    const result = await Costumer.updateOne({_id:id}, data)
    if(!result) {
        return res.status(404).send('Costumer not found.');
    } else {
        res.send(result);
    }
})

routes.delete('/:id', async (req, res) => {
    const result = await Costumer.deleteOne({_id:req.params.id})
    if(!result) {
        return res.status(404).send('Costumer not found.');
    }
    return res.send(result);
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