const Department = require("../../models/Department");
const Order = require("../../models/Order");

const getPriorityForDepartment = async (departmentID) => {
    const department = await Department.findById(departmentID).lean();

    const query = department.cities.map((city) => ({ "info.city": city }));

    return await Order.find({ $or: query }).count();
}

module.exports = { getPriorityForDepartment };
