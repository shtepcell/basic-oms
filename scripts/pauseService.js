const helper = require("../server/controllers/helper");
const Order = require("../server/models/Order");
const { orders } = require("./orders.json");

(async () => {
    for (let i = 0; i < orders.length; i++) {
        const id = orders[i];

        const order = await Order.findOne({ id });

        if (!order) {
            console.warn(`Not found order #${id}`);

            continue;
        }

        if (order.date["stop-build"] != null) {
            order.status = "stop-pause";
        } else {
            order.status = "pre-pause";
        }

        order.deadline = await helper.calculateDeadline(3);
        order.history.push({
            author: "Робот СУЗ",
            date: new Date(),
            name: `Приостановка сервиса`,
        });

        await order.save();

        console.log(`Order #${id} paused`);
    }

    process.exit(0);
})();
