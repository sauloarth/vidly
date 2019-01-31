const morgan = require('morgan');
const Joi = require('joi');
const genres = require('./data/genres');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log('Morgan enabled...');
}

app.get('/', (req, res) => {
    res.send(genres);
    console.log(genres);
});

app.get('/:id', (req, res) => {
    const data = genres.find(genre => genre.id === parseInt(req.params.id)); // req.params.id returns a string
    data ? res.send(data) : res.status(404).send('Genre not found.');
})

app.post('/', (req, res) => {
    //validating process with Joi
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //once validated, genre is "persisted".
    const newGenre = {
        id: genres.length + 1,
        genre: req.body.genre
    }

    genres.push(newGenre);
    res.send(newGenre); // returned: for the cases where the id must be known
})

app.put('/:id', (req, res) => {
    //validating process with Joi
    const { error } = validateGenre(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const data = genres.find(genre => genre.id === parseInt(req.params.id)); // req.params.id returns a string
    data ? data = req.body : res.status(404).send('Genre not found.');

    res.send(data);

    console.log(genres)

})

function validateGenre(genreObj) {
    // Joi schema accessible by all functions
    const schema = {
        genre: Joi.string().min(3).required()
    };

    return Joi.validate(genreObj, schema);
}



const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`vidly server running on port ${port}`) });