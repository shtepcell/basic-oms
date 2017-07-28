const Account = require('../server/models/Account');
const DepartmentType = require('../server/models/DepartmentType');
const initList = require('./initList');
const password = require('../server/controllers/password');

Account.find().then( acc => {
    if( acc.length == 0) {
        var admin = new Account({
            login : 'admin',
            password : password.createHash('admin'),
            department: 1,
            name : 'Admin',
            role: 0,
            status: true
        })
        console.log('Created default admin');
        return admin.save()
    }

}).then(() => {
 // TODO: Нормальная иницализация
    return DepartmentType.find().then( types => {
        if( types.length == 0) {
            for (var i = 0; i < initList.departmentTypes.length; i++) {
                var _type = new DepartmentType({
                    name: initList.departmentTypes[i].name,
                    id: initList.departmentTypes[i].id
                });
                _type.save();
            }
        }
    })

}).then( () => {
    process.exit(0);
});
