const homeRoutes = require('./routes/home');
const genresRoutes = require('./routes/genres');
const startupDebug = require('debug')('vidly:startup');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(config.get('db.path'), { useNewUrlParser: true })
    .then(console.log('Database connected.'))
    .catch(err => console.log('Error connecting on Database: ', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/genres', genresRoutes);
app.use('/', homeRoutes);

app.set('view engine', 'pug');
app.set('views', './views');



if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`vidly server running on port ${port}`) });