'use strict';

const Account = require('../models/Account');
const password = require('./password');
const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

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
            perPage = 20; // TODO брать из конфига?

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
                logger.error(err);
                // TODO: что делаем при ошибке?
            });
    },

    getOne: function (req, res) {
        Account.findOne({login: req.params.login, status: true}).then( acc => {

            render(req, res, {
                viewName: 'user',
                options: {
                    type: 'edit',
                    user: {
                        login: acc.login,
                        name: acc.name,
                        email: acc.email,
                        phone: acc.phone,
                        department: acc.department
                    }
                }
            });

        })
    },

    getProfile: function (req, res) {
        Account.findOne({login: res.locals.__user.login, status: true}).then( acc => {
            render(req, res, {
                viewName: 'user',
                options: {
                    type: 'profile',
                    user: {
                        login: acc.login,
                        name: acc.name,
                        email: acc.email,
                        phone: acc.phone,
                        department: acc.department
                    }
                }
            });
        })
    },

    create: function (req, res) {

        var reqData = req.body,
            errors = [];

        reqData.login = reqData.login.toLowerCase();

        Account.findOne({login: reqData.login})
            .then( a => {

                if( a ) errors.push({errText: 'Пользователь с таким логином уже существует!'})

                errors = validate(reqData, errors);

                if(errors.length === 0) {
                    var acc = new Account({
                        login: reqData.login,
                        password: password.createHash(reqData.password),
                        name: reqData.name,
                        email: reqData.email,
                        phone: reqData.phone,
                        department: reqData.department,
                        status: true
                    });
                    logger.info(`Created user ${ acc.login }`, res.locals.__user);
                    return acc.save();
                } else res.status(400).send(errors);

            })
            .catch( err => logger.error(err))
            .then( acc => {
                if(acc) res.send({ok: 'ok'});
            })
    },

    edit: function (req, res) {
        Account.findOne({ login: req.params.login }).then( acc => {
            var reqData = req.body;
            acc.name = reqData.name || acc.name;
            acc.email = reqData.email || acc.email;
            acc.role = reqData.role || acc.role;
            acc.status = reqData.status || acc.status;
            acc.phone = reqData.phone || acc.phone;
            acc.department = reqData.department || acc.department;
            return acc.save();
        })
        .then( () => {
            logger.info(`Edit account ${req.params.login}`, res.locals.__user);
            res.send({ok: 'ok'});
        })
        .catch( err => logger.error(err) );
    },

    selfEdit: function (req, res) {
        Account.findOne({ login: res.locals.__user.login }).then( acc => {
            acc.email = req.body.email || acc.email;
            acc.name = req.body.name || acc.name;
            acc.phone = req.body.phone || acc.phone;
            return acc.save();
        })
        .then( () => {
            logger.info(`Edit profile ${res.locals.__user.login}`, res.locals.__user);
            res.redirect('/profile');
        })
        .catch( err => logger.error(err) );

    },

    passEdit: function (req, res) {
        Account.findOne({ login: req.params.login }).then( acc => {
            if(acc)
                if(req.body.password === req.body.passwordRep) {
                    acc.password = password.createHash(req.body.password);
                    return acc.save();
                } else {
                    res.send('Пароли не совпадают') // TODO: отображение ошибок в интерфейсе
                }
        }).then( () => {
            logger.info(`Edit password ${req.params.login}`, res.locals.__user);
            res.redirect(`/admin/users/${req.params.login}`);
        })
        .catch( err => logger.error(err) );

    },

    selfPassEdit: function (req, res) {
        Account.findOne({
            login: res.locals.__user.login,
            password: password.createHash(req.body.passwordOld)
        })
        .then( acc => {
            if(acc) {
                if(req.body.password === req.body.passwordRep) {
                    acc.password = password.createHash(req.body.password);
                    return acc.save();
                } else {
                    res.send('Пароли не совпадают') // TODO: отображение ошибок в интерфейсе
                }
            } else {
                res.send('Неверующий текущий пароль') // TODO: отображение ошибок в интерфейсе
            }
        })
        .then( () => {
            logger.info(`Edit profile password`, res.locals.__user);
            res.redirect(`/profile`);
        })
        .catch( err => logger.error(err) );

    },

    remove: function (req, res) {
        Account.findOne({login: req.body.login}).then( acc => {
            if(acc != null) {
                return acc.remove();
            } else throw `Cant find account ${'login'}`;
        }).then(() => {
            logger.info(`Delete account ${req.body.login}`, res.locals.__user);
            res.send('Ok')
        })
        .catch( err => logger.error(err) );
    }
};

function validate(user, errs) {

    if( !/^[a-zA-Z][a-zA-Z0-9]+$/.test(user.login) ) errs.push({errText: 'Неверный формат логина'});

    if( user.password != user.passwordRep ) errs.push({errText: 'Пароли не совпадают'});

    return errs;
}
