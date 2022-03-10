/**
 * Created by yartiles on 3/02/18.
 */
var eventHandler = require('../socket/event-handler.js');
var moment = require('moment');
exports.start = function() {
    eventHandler.on('test', function(data) {
        console.log('event handler test-----');
        console.log(data);
    });
};