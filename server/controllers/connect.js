'use strict'

const config = require('../config');
var mongoose = require('mongoose');

// var init = require('./init');

mongoose.Promise = global.Promise;
var options = {
    promiseLibrary: global.Promise
};

var url = config.database.url;
var name = config.database.name;
var uri = 'mongodb://' + url + '/' + name;

mongoose.connect(uri, options);

mongoose.connection.on('connected', function() {
    console.log('Connected to DB.');
    // init.account();
});

module.exports = mongoose;
