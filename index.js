require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const error = require('./middlewares/error');
const winston = require('winston');
require('winston-mongodb');
const homeRoutes = require('./routes/home');
const rentalsRoutes = require('./routes/rentals');
const usersRoutes = require('./routes/users');
const genresRoutes = require('./routes/genres');
const costumersRoutes = require('./routes/customers');
const moviesRoutes = require('./routes/movies');
const authsRoutes = require('./routes/auths');
const db = require('debug')('vidly:startup');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

winston.handleExceptions(
    new winston.transports.File({filename:'unhandled.log'})
)

// process.on('uncaughtException', (ex) => {
//     console.log("Got you");
//     winston.error(ex.message, ex);
//     process.exit(1);
// })

// process.on('unhandledRejection', (ex) => {
//     console.log("Got you too.");
//     winston.error(ex.message, ex);
//     process.exit(1);
// })

process.on('unhandledRejection', (ex) => {
    throw ex;
})

if(!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

winston.add(winston.transports.File, {filename: 'logfile.log'});
//winston.add(winston.transports.MongoDB, {db: config.get('db.path')});

const p = Promise.reject(new Error('Unhandled promise error.'));
p.then(()=> console.log('Life is good with god.'));

throw new Error('Unhandled exception.')



mongoose.connect(config.get('db.path'), { useNewUrlParser: true })
    .then(db('Database connected.'))
    .catch(err => db('Error connecting on Database: ', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/genres', genresRoutes);
app.use('/api/costumers', costumersRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/rentals', rentalsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auths', authsRoutes);
app.use('/', homeRoutes);
app.use(error);

app.set('view engine', 'pug');
app.set('views', './views');


if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    db('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { db(`vidly server running on port ${port}`) });