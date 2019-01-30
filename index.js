const genres = require('./data/genres');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello you!");
});


const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`vidly server running on port ${port}`) });