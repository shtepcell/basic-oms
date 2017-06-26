'use strict'

const models = require('../models');
const Account = models.Account;
const password = require('./password');

const Render = require('../render'),
    render = Render.render;
const View = require('../views');

module.exports = {

    isLoggedIn: function (req, res, next) {
        if (req.session.__user) {
            Account.findOne({login: req.session.__user}).then( acc => {
                res.locals.__user = {
                    login: acc.login,
                    name: acc.name
                };
                next();
            })
        } else {
            if(req.path != '/login') {
                var rstr = '/login' + ( (req.originalUrl.length>1) ? '?trg='+encodeURIComponent(req.originalUrl) : '' );
                res.redirect(rstr);
            } else render(req, res, 'login');
            // render(req, res, 'login');
        }
    },

    logout: function(req, res) {
        req.session.destroy();
        res.redirect('/login')
    },

    checkAuthorisation: function (req, res) {
        console.log(req.body);
        Account.findOne({
            login: req.body.login,
            password: password.createHash(req.body.password),
            status: true
        }).then( acc => {
            if (acc) {
                req.session.__user = acc.login;
                console.log('Success authorization by :', acc.login);
                var url = req.query.trg || '/';
                res.redirect(url);
            } else {
                console.log('Fail authorization');
                res.status(401).redirect(req.originalUrl);
            }
        })
    }
}
