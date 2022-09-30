const Order = require("../models/Order");
const { render } = require("../render");

const departmentTypeFilter = (types) => (req, res, next) => {
    const userDepartmentType = res.locals.__user.department.type;

    if (types.includes(userDepartmentType)) {
        return next();
    } else {
        if (req.xhr) {
            return res.status(403).send({ error: 'Нет доступа', errText: 'Нет доступа' });
        }

        return render(req, res, { view: '403' });
    }
}

const onlyInitiatorFilter = departmentTypeFilter(['b2o', 'b2b', 'special']);
const initiatorAndAdminFilter = departmentTypeFilter(['b2o', 'b2b', 'special', 'admin']);

const privateOrder = async (req, res, next) => {
    const order = await Order.findOne({ id: req.params.id }).select('tech.private');

    if (order.tech.private && !req.locals.hasPrivateAcces) {
        if (req.xhr) {
            return res.status(403).send({ error: 'Нет доступа' });
        }

        return render(req, res, { view: '403' });
    }

    return next();
}

module.exports = {
    onlyInitiatorFilter,
    initiatorAndAdminFilter,
    privateOrder,
}
