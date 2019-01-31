const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
    res.render('index', { title: 'Vidly', message: 'Welcome!' });
})

module.exports = routes;