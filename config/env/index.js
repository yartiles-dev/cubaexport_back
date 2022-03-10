'use strict';

var path  = require('path');
var nconf = require('nconf');

/*
 * Setup nconf to use (in-order):
 *  1. Command-line arguments.
 *  2. Environment variables.
 */
nconf
  .argv()
  .env();

var environment = nconf.get('NODE_ENV') || process.env.NODE_ENV || 'development';
// var environment = process.env.NODE_ENV
console.log(environment)
environment     = environment.toLowerCase();
nconf.file(environment, path.dirname(require.main.filename) + '/config/env/' + environment + '.json');
nconf.set('env', environment);

module.exports = nconf;