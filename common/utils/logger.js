
'use strict';

const winston = require('winston');
const console = new winston.transports.Console();
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.splat()
    ),
    transports: [
        console
    ],
});

exports.logger = logger;
