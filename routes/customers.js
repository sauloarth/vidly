const express = require('express');
const routes = express.Router();
const { Customer } = require('../models/customer');
const { validate } = require('../models/customer');

const db = require('debug')('vidly:customersRoutes');

routes.get('/', async (req, res) => {
    const results = await Customer.find();   
    res.send(results);
    db(results);
})

routes.get('/:id', async (req, res) => {
    const result = await Customer.findById(req.params.id);
    result ? res.send(result) : res.status(404).send('Customer not found.');
    // TODO: it runs into an error when an id greater
    // or less than the regular id is passed.
})

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    const result = await customer.save();
    if(result) 
        return res.send(`Customer ${result.name} saved with success.`); 
    else
        return res.status(404).send('Customer could not be saved.');

})

routes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    const { error } = validate(data);
    if(error) {
        //validation error
        return res.status(400).send(error.details[0].message);
    } 

    const result = await Customer.updateOne({_id:id}, data)
    if(!result) {
        return res.status(404).send('Customer not found.');
    } else {
        res.send(result);
    }
})

routes.delete('/:id', async (req, res) => {
    const result = await Customer.deleteOne({_id:req.params.id})
    if(!result) {
        return res.status(404).send('Customer not found.');
    }
    return res.send(result);
})

module.exports = routes;