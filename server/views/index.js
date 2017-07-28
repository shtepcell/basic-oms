'use strict';

var views = ['login', 'main', 'users','user', 'profile', 'handbook', 'departments'];

views.forEach(view => {
    module.exports[view] = require('./' + view);
});
