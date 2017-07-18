'use strict'

const config = require('../config');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    promiseLibrary: global.Promise
};

var url = config.database.url;
var name = config.database.name;
var uri = 'mongodb://' + url + '/' + name;

mongoose.connect(uri, options);

mongoose.connection.on('connected', function() {
    console.log('Connected to DB.');
});

module.exports = mongoose;
