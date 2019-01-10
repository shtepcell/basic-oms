var mongoose = require('../controllers/connect');

var schema = new mongoose.Schema( {
    orderId: Number
});

var static;

schema.statics.getOrderId = async () => {
   const st = await static.findOne();

   const id = ++st.orderId;
   st.save();
   return id;
};


static = mongoose.model('Static', schema);
module.exports = static;
