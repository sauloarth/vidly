const express = require('express')
const routes = express.Router();
const genres = require('../data/genres');
const Joi = require('joi');
const dataDebug = require('debug')('vidly:data');
const mongoose = require('mongoose');
const Genre = require('../models/genre');

routes.get('/', (req, res) => {
    async function getGenres() {
        return await Genre.find();
    }

    async function sendGenres() {
        const results = await getGenres();
        res.send(results);
        dataDebug(results);
    }

    sendGenres();
});

routes.get('/:id', (req, res) => {
    const data = genres.find(genre =>
        genre.id === parseInt(req.params.id)); // req.params.id returns a string
    data ? res.send(data) : res.status(404).send('Genre not found.');
})

routes.post('/', (req, res) => {
    //validating process with Joi
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //once validated, genre is "persisted".
    const newGenre = {
        id: genres.length + 1,
        genre: req.body.genre
    }

    genres.push(newGenre);
    res.send(newGenre); // returned: for the cases where the id must be known
})

routes.put('/:id', (req, res) => {
    const data = genres.find(genre =>
        genre.id === parseInt(req.params.id)); // req.params.id returns a string
    if (!data) return res.status(404).send('Genre not found.');

    //validating process with Joi
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //if values turned down to be valid the array is changed.
    data.genre = req.body.genre;
    res.send(data);

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
        genre: Joi.string().min(3).required()
    };

    return Joi.validate(genreObj, schema);
}

module.exports = routes;