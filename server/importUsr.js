var users = require('./users'),
    Account = require('./models/Account'),
    Department = require('./models/Department'),
    password = require('./controllers/password');

(async () => {

    for (var i = 0; i < users.length; i++) {
        if(users[i].department == 'Без отдела') users[i].department = 'Администрация';
        if(users[i].department == '') users[i].department = 'Администрация';
        var dep = await Department.findOne({name: users[i].department});
        var usr = new Account({
            login: users[i].login,
            password: password.createHash(users[i].login),
            name: users[i].name,
            email: users[i].email,
            phone: users[i].phone,
            department: dep,
            status: true
        })

        usr.save();
    }

    process.exit(0);

})();
