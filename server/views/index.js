'use strict';

var views = ['login', 'main', 'users','user', 'profile', 'handbook'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
