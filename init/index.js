const Account = require('../server/models/Account');
const Department = require('../server/models/Department');
const initList = require('./initList');
const password = require('../server/controllers/password');

var init = async () => {
    var accs = await Account.find();
    var deps = await Department.find();
    var results = [];

    if( deps.length === 0 ) {
        for (var i = 0; i < initList.departments.length; i++) {
            var item = initList.departments[i];
            var dp = new Department ({
                name: item.name,
                type: item.type
            });
            results.push(await dp.save());
        }
    }

    if(accs.length === 0) {
        var admin = new Account({
                login : 'admin',
                password : password.createHash('admin'),
                department: await Department.findOne({ type: 'admin' }),
                name : 'Admin',
                role: 0,
                status: true
            })
        return admin.save();
    }
}

init().then( () => {
    process.exit(0);
})
