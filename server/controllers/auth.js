'use strict'

const models = require('../models');
const Account = models.Account;
const Department = models.Department;
const password = require('./password');
const logger = require('./logger');
const Render = require('../render'),
    render = Render.render;
const View = require('../views');
const Notify = require('./notify');

module.exports = {
    getLogin: async (req, res) => {
        if(req.session.__user) {
            res.redirect('/');
        } else render(req, res, {
            viewName: 'login'
        })
    },

    isLoggedIn: async (req, res, next) => {
        if (req.session.__user) {
            var acc = await Account.findOne({login: req.session.__user}).populate('department');
            var deps = await Department.find({status: true, type: 'gus'}).lean();

            res.locals.__deps = deps;
            res.locals.__user = {
                _id: acc._id,
                login: acc.login,
                name: acc.name,
                department: acc.department,
                notifies: await Notify.countUnread(acc),
                settings: acc.settings
            };
            next();
        } else {
            if(req.path != '/login') {
                res.locals.trg = '/login?trg=' + encodeURIComponent(req.originalUrl);
            }
            render(req, res, {
                viewName: 'login'
            })
        }
    },

    isAdmin: function (req, res, next) {
        if(res.locals.__user.department.type == 'admin') next();
        else res.status(403).send('Доступ только для администраторов')
    },

    logout: function(req, res) {
        req.session.destroy();
        res.redirect('/')
    },

    checkAuthorisation: async (req, res) => {
        var acc = await Account.findOne({
            login: req.body.login,
            password: password.createHash(req.body.password),
            status: true
        })

        if (acc) {
            req.session.__user = acc.login;
            logger.info(`Success authorization by : ${acc.login}`);
            var url = req.query.trg || '/';
            res.redirect(url);
        } else {
            logger.warn(`Fail authorization.`);
            res.status(401).redirect(req.originalUrl);
        }
    }
}
