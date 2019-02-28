const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/loggin')();
require('./startup/config')(app);
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/infra')();

const port = process.env.PORT || 3000;
app.listen(port, () => { 
    winston.info(`vidly server running on port ${port}`) 
});