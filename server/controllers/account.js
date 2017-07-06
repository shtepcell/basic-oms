'use strict';

const Account = require('../models/Account');
const password = require('./password');
const Render = require('../render'),
    render = Render.render;

module.exports = {
    getAll: function (req, res) {
        Account.find({status: true}).then( accs => {
            res.locals.users = accs;
            render(req, res, 'users');
        })
    },
    getPage: function (req, res) {
        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 5; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        Account.paginate({status: true}, { page: pageNumber, limit: perPage})
            .then((accs) => {
                if (!accs.docs.length)
                {
                    res.redirect(req.path);
                    return;
                }

                res.locals.users = accs.docs;
                res.locals.pagers = {};
                res.locals.pagers[pagerId] = {
                    pageNumber: +pageNumber,
                    records: accs.total,
                    perPage: accs.limit
                };
                render(req, res, {
                    viewName: 'users',
                    options: {
                        pagers: pagers
                    }
                });
            })
            .catch((err) => {
                console.log('errr', err);
                // TODO: что делаем при ошибке?
            });
    },
    getOne: function (req, res) {
        Account.findOne({login: req.params.login, status: true}).then( acc => {
            res.locals.user = {
                login: acc.login,
                name: acc.name,
                email: acc.email,
                department: acc.department
            };

            render(req, res, {
                viewName: 'user',
                options: {
                    type: 'edit',
                    login: acc.login
                }
            });
        })
    },
    getProfile: function (req, res) {
        Account.findOne({login: res.locals.__user.login, status: true}).then( acc => {
            res.locals.user = {
                login: acc.login,
                name: acc.name,
                email: acc.email,
                department: acc.department
            };

            render(req, res, {
                viewName: 'user',
                options: {
                    type: 'profile',
                    login: acc.login
                }
            });
        })
    },
    create: function (req, res) {
        Account.findOne({login: req.body.login})
            .then( a => {
                if (!a) {
                    var acc = new Account({
                        login: req.body.login,
                        password: password.createHash(req.body.password),
                        name: req.body.name,
                        email: req.body.email,
                        department: req.body.department,
                        status: true
                    });
                    return acc.save();
                    console.log('Created user', acc.login);
                }
            })
            .then( () => res.redirect('/admin/users'))
    },
    edit: function (req, res) {
        console.log();
        Account.findOne({ login: req.params.login }).then( acc => {
            acc.name = req.body.name || acc.name;
            acc.email = req.body.email || acc.email;
            acc.role = req.body.role || acc.role;
            acc.status = req.body.status || acc.status
            console.log(acc);
            return acc.save();
        }).then( () => {
            console.log('Edit account', req.params.login);
            res.redirect('/admin/users/'+req.params.login)
        });
    },
    selfEdit: function (req, res) {
        Account.findOne({ login: res.locals.__user.login }).then( acc => {
            acc.email = req.body.email || acc.email;
            acc.name = req.body.name || acc.name;
            return acc.save();
        }).then( () => {
            console.log('Edit profile', res.locals.__user.login);
            res.redirect('/profile');
        });
    },
    passEdit: function (req, res) {
        Account.find({ login: req.body.login }).then( acc => {
            acc.password = passord.createHash(req.body.password);
            return acc.save();
        }).then( () => {
            console.log('Edit pass', req.body.login);
            res.send('Ok');
        });
    },
    remove: function (req, res) {
        Account.findOne({login: req.body.login}).then( acc => {
            if(acc != null) {
                return acc.remove();
            } else throw `Cant find account ${'login'}`;
        }).then(() => res.send('Ok'), err => {
            console.log(err); //TODO: LOGGER
            res.send(err);
        });
    }
};
