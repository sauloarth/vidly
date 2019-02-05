const express = require('express')
const routes = express.Router();
const genres = require('../data/genres');
const Joi = require('joi');
const db = require('debug')('vidly:data');
const mongoose = require('mongoose');
const Genre = require('../models/genre');

routes.get('/', (req, res) => {
    async function getGenres() {
        return await Genre.find();
    }

    async function sendGenres() {
        const results = await getGenres();
        res.send(results);
        db(results);
    }

    sendGenres();
});

routes.get('/:id', (req, res) => {
    const id = req.params.id;
    db(id);
    async function getGenreById(id) {
        const genre = await Genre.findById(id)
        genre ? res.send(genre) : res.status(404).send('Genre not found.');
    }

    getGenreById(id);

})

routes.post('/', (req, res) => {
    //validating process with Joi
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //once validated, genre is persisted.
    const genre = new Genre({
        name: req.body.name
    });

    async function createGenre(genre) {
        const result = await genre.save();
        result ? 
        res.send(`Genre ${result.name} saved with success`) : 
        res.status(404).send('Genre could not to be saved.');
    }
    createGenre(genre);
})

routes.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    //validating process with Joi
    const { error } = validateGenre(data);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    updateById(id, data);
    async function updateById(id, data) {
        const result = await Genre.updateOne({_id:id}, data)
        if(!result) {
            return res.status(404).send('Genre not found.');
        }

        return res.send(result); // if values turned down to be valid the array is changed.
    }
})

routes.delete('/:id', (req, res) => {

    const data = genres.find(genre =>
        genre.id === parseInt(req.params.id)); // req.params.id returns a string
    if (!data) return res.status(404).send('Genre not found');

    const index = genres.indexOf(data);

    genres.splice(index, 1);
    res.send(data);
})


function validateGenre(genreObj) {
    // Joi schema accessible by all functions
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genreObj, schema);
}

module.exports = routes;