const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const { Rental } = require('../models/rental');
const { validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Fawn = require('fawn');
const db = require('debug')('vidly:rentalRoute');

Fawn.init(mongoose);

routes.get('/', async (req, res) => {
    const rentals = await Rental.find();
    res.send(rentals);
})

routes.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findOne({_id: req.body.movieId});
    if(!movie) return res.status(400).send('Movie not found.');

    const customer = await Customer.findOne({_id: req.body.customerId});
    if(!customer) return res.status(400).send('Customer not found');

    const rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            title: movie.title
        }
    });

    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: {
                    numberInStock: -1
                }
            })
            .run();

            res.status(400).send(`Movie rented`);
            db(rental);

    } catch (err) {
        res.status(500).send('Rental not registred.');
    }
})

module.exports = routes;