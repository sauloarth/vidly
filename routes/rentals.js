const express = require('express');
const routes = express.Router();
const { Rental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const Joi = require('joi');
const db = require('debug')('vidly:rentalRoute');

routes.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if(error) return res.send(400, error.details[0].message);

    const movie = await Movie.findOne({_id: req.body.movieId});
    if(!movie) return res.send(400, 'Movie not found.');
    db(movie);

    const customer = await Customer.findOne({_id: req.body.customerId});
    if(!customer) return res.send(400, 'Customer not found');
    db(customer);

    const rental = new Rental({ 
        amountOfDays: req.body.amountOfDays,
        customer: {
            _id: customer._id,
            name: customer.name,
        },
        movie: {
            _id: movie._id,
            title: movie.title
        }
    });

    db(rental);

    const result = await rental.save();
    if(result) return res.status(400).send(`Movie rented`);

    return res.status(404).send('Rent operation could not have be finished.');

    
})

function validateRental(rental) {
    const schema = {
        initDate: Joi.date().required(),
        amountOfDays: Joi.number().max(10).min(1),
        customerId: Joi.required(),
        movieId: Joi.required()
    }

    return Joi.validate(rental, schema);
}

module.exports = routes;