const express = require('express');
const routes = express.Router();
const { Movie }  = require('../models/movie');
const { validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const db = require('debug')('vidly:moviesRoutes');

routes.get('/', async (req, res) => {
    const movie = await Movie.find();
    res.send(movie);
    db(movie);
})

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
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

    const { error } = validate(data);
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

routes.delete('/:id', async (req, res) => {
    const result = await Movie.deleteOne({_id: req.params.id});
    if(result.deletedCount === 0) {
        return res.status(404).send('Movie was not deleted.');
    }
    return res.send('The movie was successfuly deleted.');
})

module.exports = routes;