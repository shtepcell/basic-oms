'use strict';

const Account = require('../models/Account');
const Department = require('../models/Department');
const password = require('./password');
const Render = require('../render'),
    render = Render.render;

const logger = require('./logger');

module.exports = {

    getPage: async (req, res) => {
        var pagerId = 'first',
            pagers = [],
            pageNumber = req.query['pager' + pagerId] || 1,
            perPage = 30; // TODO брать из конфига?

        if (!!(+pageNumber) && (+pageNumber) > 0) {
            pageNumber = +pageNumber;
            pagers[0] = pagerId;
        }
        else
            res.redirect(req.path);

        var accs = await Account.paginate({status: true}, {page: pageNumber, limit: perPage, populate: 'department'});

        if(req.query.name) {
            var rgx =  new RegExp('' + req.query.name + '', 'i');
            accs = await Account.paginate({name: {$regex: rgx}, status: true}, {page: pageNumber, limit: perPage, populate: 'department'});
        }

        if(accs.total == 0) accs.total = 1;
        res.locals.query = req.query;
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
                pagers: pagers,
                reqUrl: '/admin/users'
            }
        });

    },

    getPageCreate: async (req, res) => {
        res.locals.departments = await Department.find();

        render(req, res, {
            viewName: 'user',
            options: {
                type: 'create'
            }
        });
    },

    getOne: async (req, res) => {
        var acc = await Account.findOne({login: req.params.login, status: true});
        res.locals.departments = await Department.find();

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
    },

    getProfile: async (req, res) => {
        res.locals.user = await Account.findOne({login: res.locals.__user.login, status: true}).populate('department');
        res.locals.departments = await Department.find();

        render(req, res, {
            viewName: 'user',
            options: {
                page: 'profile'
            }
        });
    },

    create: async (req, res) => {

        var reqData = req.body,
            errors = [];

        reqData.login = reqData.login.toLowerCase();

        if( !!await Account.findOne({ login: reqData.login }) )
            errors.push({errText: 'Пользователь с таким логином уже существует!'})

        errors = validate(reqData, errors);

        if(errors.length === 0) {
            var acc = new Account({
                login: reqData.login,
                password: password.createHash(reqData.password),
                name: reqData.name,
                email: reqData.email,
                phone: reqData.phone,
                department: await Department.findOne({ _id: reqData.department }),
                status: true
            });
            var result = await acc.save();
        } else res.status(400).send(errors);

        if(!!result) {
            logger.info(`Created user ${ acc.login }`, res.locals.__user);
            res.send({ok: 'ok'});
        }

    },

    edit: async (req, res) => {
        var acc = await Account.findOne({ login: req.params.login });
        var reqData = req.body;

        acc.name = reqData.name || acc.name;
        acc.email = reqData.email || acc.email;
        acc.role = reqData.role || acc.role;
        acc.status = reqData.status || acc.status;
        acc.phone = reqData.phone || acc.phone;
        acc.department = await Department.findOne({ _id: reqData.department }) || acc.department;

        var result = await acc.save();
        if(!!result) {
            logger.info(`Edit account ${req.params.login}`, res.locals.__user);
            res.send({ok: 'ok'});
        }
    },

    selfEdit: async (req, res) => {
        var acc = await Account.findOne({ login: res.locals.__user.login });
        console.log(req.body);
        acc.email = req.body.email || acc.email;
        acc.name = req.body.name || acc.name;
        acc.phone = req.body.phone || acc.phone;

        var result = await acc.save();

        if(!!result) {
            logger.info(`Edit profile ${res.locals.__user.login}`, res.locals.__user);
            res.send({ok: 'ok'});
        }

    },

    passEdit: async (req, res) => {
        var acc = await Account.findOne({ login: req.params.login });

        if(acc && req.body.password === req.body.passwordRep) {
            acc.password = password.createHash(req.body.password);
            var result = await acc.save();
        } else {
            res.status(400).send([{errText: 'Пароли не совпадают!'}]);
        }

        if(!!result) {
            logger.info(`Edit password ${req.params.login}`, res.locals.__user);
            res.send({ok: 'ok'});
        }

    },

    selfPassEdit: async (req, res) => {
        var acc = await Account.findOne({
            login: res.locals.__user.login,
            password: password.createHash(req.body.passwordOld)
        });

        if(acc) {

            if(req.body.password === req.body.passwordRep) {
                acc.password = password.createHash(req.body.password);
                var result = await acc.save();
            } else res.status(400).send([{errText: 'Пароли не совпадают!'}]);

        } else res.status(400).send([{errText: 'Неверный пароль!'}]);
        if(!!result) {
            logger.info(`Edit profile password`, res.locals.__user);
            res.send({ok: 'ok'});
        }

    }
};

function validate(user, errs) {

    if( !/^[a-zA-Z][a-zA-Z0-9]+$/.test(user.login) ) errs.push({errText: 'Неверный формат логина'});

    if( user.password != user.passwordRep ) errs.push({errText: 'Пароли не совпадают'});

    return errs;
}
