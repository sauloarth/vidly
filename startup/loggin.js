const winston = require('winston');

require('winston-mongodb');
require('express-async-errors');

module.exports = function(){
    winston.add(winston.transports.File, {filename: 'logfile.log'});
    
    //handling unhandled errors
    winston.handleExceptions(
        new winston.transports.File({filename:'unhandled.log'})
        )
        
    //handling unhandled rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    })


}