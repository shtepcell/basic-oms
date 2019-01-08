const Order = require('../server/models/Order');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const addDeadline = async (answer) => {
    const days = answer;
    
    var orders = await Order.find({deadline: {$ne: null}, "pause.status": { $ne: true }  });

    for (var i = 0; i < orders.length; i++) {
        orders[i].deadline = calculateDeadline(days, orders[i].deadline);
        orders[i].save();
    }

    console.log('Done!');
}

(async () => {

    rl.question('Input count of days: ', (answer) => {
        if (!isNaN(answer)) {
            addDeadline(answer);
        }
        rl.close();
      });
})();


function calculateDeadline (time, from) {
    if(!time) console.log('warning');
    var now = from;

    var i = 0;

    while (time > 0) {
        var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);

        if(day.getDay() != 6 && day.getDay() != 0) {
            time--;
        }
        i++;
    }

    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, 0, 0, 0, 0);
}
