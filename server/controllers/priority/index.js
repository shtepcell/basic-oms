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

    return Order.find({ $or: citiesQuery }).where('status').in(ACTIVE_STATUSES).count();
}

const isAviableToCreatePriorityOrder = async (cityId) => {
    const gus = await helper.getGUSByCity(cityId);

    const countPO = await countPriorityOrders(gus._id);

    if (countPO >= gus.priorityCapacity) {
        return { status: 'error', gus, countPO };
    }

    return { status: 'ok', gus, countPO };
}

module.exports = { countPriorityOrders, isAviableToCreatePriorityOrder, ACTIVE_STATUSES };
