const express = require('express');
const routes = express.Router();
const Movie = require('../models/movie');
const { Genre } = require('../models/genre');
const Joi = require('joi');
const db = require('debug')('vidly:moviesRoutes');

routes.get('/', async (req, res) => {
    const movie = await Movie.find();
    res.send(movie);
    db(movie);
})

routes.post('/', async (req, res) => {
    const { error } = validateMovie(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result = await movie.save();
    if(result) 
        res.send(`Movie ${result.title} saved with success.`);
    else 
        res.status(404).send('Movie could not be saved.');
})

routes.put('/:id', async (req, res) => {
    const id = req.params.id;
    let data = req.body;
    db(data);

    const { error } = validateMovie(data);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(data.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    const result = await Movie.findOneAndUpdate(id, {
        title: data.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, {new: true});

    if(result) 
        res.send(result);
    else 
        res.status(404).send('Movie could not be updated.');

})

function validateMovie(movie) {
    const schema = {
        title: Joi.string().required().min(3).max(100),
        genreId: Joi.required(),
        numberInStock: Joi.number().required().min(0),
        dailyRentalRate: Joi.number().required().min(0)
    }

    return Joi.validate(movie, schema);
}

module.exports = routes;