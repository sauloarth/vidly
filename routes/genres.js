const express = require('express');
const routes = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const db = require('debug')('vidly:data');
const { Genre } = require('../models/genre');
const { validate } = require('../models/genre');

routes.get('/', async (req, res) => {
    throw new Error('Could not get the genres');
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

routes.post('/', auth, async (req, res) => {
    // validation process with Joi
    const { error } = validate(req.body);
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
        res.status(404).send('Genre could not be saved.');
    }

})

routes.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    // validation process with Joi
    const { error } = validate(data);
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

routes.delete('/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;

    const result = await Genre.deleteOne({_id:id})
    if(!result) {
        // DEBUG: even when document is not deleted it returns an object
        return res.status(404).send('Genre not found.');
    }

    return res.send(result); 
})


module.exports = routes;