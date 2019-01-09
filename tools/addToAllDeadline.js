const Order = require('../server/models/Order');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const addDeadline = async (answer, query) => {
    const days = answer;
    
    var orders = await Order.find(query);

    let results = [];

    if (orders.length == 0) {
        console.log('Order not found!');
        process.exit(1);
        return;
    }

    if (orders.length > 1) {
        console.log(`Found ${orders.length} orders!`)
    }
    
    for (var i = 0; i < orders.length; i++) {
        const order =  orders[i];
        order.deadline = calculateDeadline(days, order.deadline);
        results.push(order.save());
    }

    Promise.all(results).then( () => {
        console.log('Done!');
        process.exit(0);
    })
}

(async () => {
    rl.question('Input ID order or type "all": ', (order) => {
        let query;

        if (order.match((/^a(ll)?$/i))) {
            query = {deadline: {$ne: null}, "pause.status": { $ne: true }  };
        }

        if (!isNaN(order)) {
            query = {id: order}
        }

        if (!query) {
            console.log('Wrong answer!');
            process.exit(1);
        }

        rl.question('Input count of days: ', (answer) => {
            if (!isNaN(answer) && answer != '' && Number.isInteger(+answer) && answer > 0) {
                addDeadline(answer, query);
            } else {
                console.log('Incorrect number of days!');
                process.exit(1);
            }
            rl.close();
        });
    })
    


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