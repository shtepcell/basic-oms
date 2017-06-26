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
    getOne: function (req, res) {
        Account.findOne({login: 'some', status: true}).then( acc => {
            res.end(JSON.stringify(acc));
        })
    },
    create: function (req, res) {
        var acc = new Account({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            status: true
        });
        return acc.save();
    },
    edit: function (req, res) {
        Account.find({ login: req.body.login }).then( acc => {
            acc.name = req.body.name;
            acc.email = req.body.email;
            acc.role = req.body.role;
            acc.status = req.body.status;
            return acc.save();
        }).then( () => {
            console.log('Edit account', req.body.login);
            res.send('Ok');
        });
    },
    selfEdit: function (req, res) {
        Account.find({ login: req.body.login }).then( acc => {
            acc.email = req.body.email;
            acc.name = req.body.name;
            return acc.save();
        }).then( () => {
            console.log('Edit account', req.body.login);
            res.send('Ok');
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
