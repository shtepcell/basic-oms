const Department = require("../../models/Department");
const Order = require("../../models/Order");
const helper = require("../helper");

const ACTIVE_STATUSES = ['client-match', 'all-pre', 'gzp-pre', 'gzp-build', 'install-devices', 'network'];

const countPriorityOrders = async (departmentID) => {
    const department = await Department.findById(departmentID).lean();

    const citiesQuery = department.cities.map((city) => ({ "info.city": city }));

    if (!citiesQuery.length) {
        return 0;
    }

    console.log()
    return await Order.find({ $or: citiesQuery }).where('status').in(ACTIVE_STATUSES).where('tech.priority').eq(true).count();
}

const isAviableToCreatePriorityOrder = async (cityId) => {
    const gus = await helper.getGUSByCity(cityId);

    const countPO = await countPriorityOrders(gus._id);

    console.log(countPO)
    if (countPO >= gus.priorityCapacity) {
        return { status: 'error', gus, countPO };
    }

    return { status: 'ok', gus, countPO };
}

const setPriority = async (orderId, priority, user) => {
    if (priority) {
        const order = await Order.findOne({ id: orderId }).lean();

        const { status, gus } = await isAviableToCreatePriorityOrder(order.info.city);

        if (status === 'error') {
            return { statusCode: 400, status: 'error', errText: `Достигнуто максимальное кол-во активных приоритетных заказов (${gus.priorityCapacity}) для ${gus.name}` };
        }
    }

    const historyEvent = helper.historyGenerator('priority', user, { priority });

    await Order.update({ id: orderId }, { $set: { 'tech.priority': priority }, $push: { 'history': historyEvent } });

    return { statusCode: 200, status: 'ok' };
}

module.exports = { countPriorityOrders, isAviableToCreatePriorityOrder, ACTIVE_STATUSES, setPriority };
