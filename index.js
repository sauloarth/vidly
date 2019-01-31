const Joi = require('joi');
const genres = require('./data/genres');
const express = require('express');
const app = express();

app.use(express.json());

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
    const schema = {
        genre: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    //once validated, genre is "persisted".
    const newGenre = {
        id: genres.length + 1,
        genre: req.body.genre
    }

    genres.push(newGenre);
    res.send(newGenre); // returned: for the cases where the id must be known
})



const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`vidly server running on port ${port}`) });