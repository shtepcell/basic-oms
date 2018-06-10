var mongoose = require('../controllers/connect'),
	Schema = mongoose.Schema;

var schema = new Schema( {
    date: {
        type: Date,
        required: true,
        unique: true
    }
});

var holidays = mongoose.model('Holiday', schema);
module.exports = holidays;
