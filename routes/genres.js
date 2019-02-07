const express = require('express')
const routes = express.Router();
const genres = require('../data/genres');
const Joi = require('joi');
const db = require('debug')('vidly:data');
const mongoose = require('mongoose');
const Genre = require('../models/genre');

routes.get('/', async (req, res) => {
    const results = await Genre.find();   
    res.send(results);
    db(results);
});

routes.get('/:id', async (req, res) => {
    const id = req.params.id;
    const genre = await Genre.findById(id)
    genre ? res.send(genre) : res.status(404).send('Genre not found.');
    // TODO: it runs into an error when an id greater
    // or less than the regular id is passed.
})

routes.post('/', async (req, res) => {
    // validation process with Joi
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // creating object to persist
    const genre = new Genre({
        name: req.body.name
    });

    // trying to persist into the database
    const result = await genre.save();
    if(result) {
        res.send(`Genre ${result.name} saved with success`); 
    } else {
        res.status(404).send('Genre could not to be saved.');
    }

})

routes.put('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    // validation process with Joi
    const { error } = validateGenre(data);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // trying to persist into the database
    const result = await Genre.updateOne({_id:id}, data)
    if(!result) {
        // DEBUG: even when document is not changed it returns an object
        return res.status(404).send('Genre not found.');
    } else {

        return res.send(result); 
    }

})

routes.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const result = await Genre.deleteOne({_id:id})
    if(!result) {
        // DEBUG: even when document is not deleted it returns an object
        return res.status(404).send('Genre not found.');
    }

    return res.send(result); 
})


function validateGenre(genreObj) {
    // Joi schema accessible by all functions
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genreObj, schema);
}

module.exports = routes;