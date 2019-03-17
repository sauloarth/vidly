const config = require('config');
const morgan = require('morgan');
const express = require('express');

/*
 * Sounds confuse import express again but
 * remember: what handle the server request
 * is the one inside the app object.
 */

module.exports = function(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));

    //config view engine
    app.set('view engine', 'pug');
    app.set('views', './views');

    //jwtPrivateKey is a must
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
    }

    //turn on/off morgan depending on env
    if (app.get('env') === 'development') {
        app.use(morgan('tiny'));
    }
}