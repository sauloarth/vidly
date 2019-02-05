const homeRoutes = require('./routes/home');
const genresRoutes = require('./routes/genres');
const startupDebug = require('debug')('vidly:startup');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/genres', genresRoutes);
app.use('/', homeRoutes);

app.set('view engine', 'pug');
app.set('views', './views');


//Configuration
startupDebug(`Application Name: ${config.get('name')}`);
startupDebug(`DB Path: ${config.get('db.path')}`);


if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`vidly server running on port ${port}`) });