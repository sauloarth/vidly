const express = require('express');
const homeRoutes = require('../routes/home');
const rentalsRoutes = require('../routes/rentals');
const usersRoutes = require('../routes/users');
const genresRoutes = require('../routes/genres');
const costumersRoutes = require('../routes/customers');
const moviesRoutes = require('../routes/movies');
const authsRoutes = require('../routes/auths');
const db = require('debug')('vidly:routes');
const error = require('../middlewares/error');

module.exports = function(app){
    app.use(express.json());
    app.use('/api/genres', genresRoutes);
    app.use('/api/costumers', costumersRoutes);
    app.use('/api/movies', moviesRoutes);
    app.use('/api/rentals', rentalsRoutes);
    app.use('/api/users', usersRoutes);
    app.use('/api/auths', authsRoutes);
    app.use('/', homeRoutes);
    app.use(error);
}