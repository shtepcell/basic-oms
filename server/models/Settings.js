const mongoose = require('../controllers/connect');

const schema = new mongoose.Schema({
	type: {
        type: String,
        required: true,
    },
    data: Object,
});

module.exports = mongoose.model('Settings', schema);