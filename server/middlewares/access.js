const { render } = require("../render");

const departmentTypeFilter = (types) => (req, res, next) => {
    const userDepartmentType = res.locals.__user.department.type;

    if (types.includes(userDepartmentType)) {
        return next();
    } else {
        if (req.xhr) {
            return res.status(403).send({ error: 'Нет доступа' });
        }

        return render(req, res, { view: '403' });
    }
}

const onlyInitiatorFilter = departmentTypeFilter(['b2o', 'b2b', 'special']);
const initiatorAndAdminFilter = departmentTypeFilter(['b2o', 'b2b', 'special', 'admin']);

module.exports = {
    onlyInitiatorFilter,
    initiatorAndAdminFilter,
}
