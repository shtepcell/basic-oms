var Order = require('../server/models/Order');
var Holiday = require('../server/models/Holiday');

var now = new Date();
var day = new Date(now.getFullYear(), now.getMonth(), now.getDate());

if(now.getDay() == 1 || now.getDay() == 0) process.exit(0);

Holiday.findOne({date: day}).then( date => {
    if(date) {
        process.exit(0);
    } else {
        Order.updateMany({cs: {'$ne': null}}, {$inc: { cs: -1 }}, {multi: true}).then( d => {
            console.log('Decrement is done!');
            process.exit(0);
        })
    }
})
