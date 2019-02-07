const homeRoutes = require('./routes/home');
const genresRoutes = require('./routes/genres');
const costumersRoutes = require('./routes/costumers');
const db = require('debug')('vidly:startup');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(config.get('db.path'), { useNewUrlParser: true })
    .then(db('Database connected.'))
    .catch(err => db('Error connecting on Database: ', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/genres', genresRoutes);
app.use('/costumers', costumersRoutes);
app.use('/', homeRoutes);

app.set('view engine', 'pug');
app.set('views', './views');



if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    db('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { db(`vidly server running on port ${port}`) });