const Account = require('../server/models/Account');
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
    process.exit();
});
