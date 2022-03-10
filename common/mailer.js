'use strict';

var nodemailer = require('nodemailer');
var mailerConfig = global.app.config.get('mailer');
var activeService = mailerConfig.activeService;
var options = mailerConfig.services[activeService];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
var transporter = nodemailer.createTransport(options);

// verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Smtp Server is ready to take our messages");
    }
});

exports.mailer = transporter;