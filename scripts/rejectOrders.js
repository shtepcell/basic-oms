const Order = require('../server/models/Order');
const { orders, reason } = require('./orders.json');

(async () => {
    if (!reason) {
        console.error('Укажите причину');
        process.exit(1);
    }

    for (let i = 0; i < orders.length; i++) {
        const id = orders[i];

        const order = await  Order.findOne({ id });

        if (!order) {
            console.warn(`Not found order #${id}`);

            continue;
        }

        order.status = 'reject';
        order.deadline = null;

        order.history.push({
            author: 'Робот СУЗ',
            date: new Date(),
            name: `Заказ отклонен. Причина: ${reason}`
        });

        await order.save();

        console.log(`Order #${id} rejected`);
    }

    process.exit(0);
})();

