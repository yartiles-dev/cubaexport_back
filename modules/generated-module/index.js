'use strict';
const generateRoutes = require('./routes/generate/route')
const generateController = require('./controllers/generatecontroller')

exports.setRoutes = function setRoutes() {
    new generateRoutes(generateController)
};