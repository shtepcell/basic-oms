const Department = require("../../models/Department");
const Order = require("../../models/Order");

const ACTIVE_STATUSES = ['client-match', 'all-pre', 'gzp-pre', 'gzp-build', 'install-devices', 'network'];

const getPriorityForDepartment = async (departmentID) => {
    const department = await Department.findById(departmentID).lean();

    const citiesQuery = department.cities.map((city) => ({ "info.city": city }));

    if (!citiesQuery.length) {
        return 0;
    }

    return await Order.find({ $or: citiesQuery }).where('status').in(ACTIVE_STATUSES).count();
}

module.exports = { getPriorityForDepartment };
