const Auth = require('./controllers/auth');
const Account = require('./controllers/account');

var Render = require('./render'),
    render = Render.render;

module.exports = function (app) {

    app.get('/ping/', function(req, res) {
        res.send('ok');
    });

    app.post('/login', Auth.checkAuthorisation);

    app.all('*', Auth.isLoggedIn);

    app.get('/logout', Auth.logout);

    app.get('/', function (req, res) {
        render(req, res, 'main');
    });

    // app.all('/admin/*', Auth.isAdmin);

    app.get('/admin/users', Account.getPage);


    app.get('/admin/users/add', function (req, res) {
        render(req, res, {
            viewName: 'user',
            options: {
                type: 'create'
            }
        });
    });
    app.post('/admin/users/add', Account.create);

    app.get('/admin/users/:login', Account.getOne);
    app.post('/admin/users/:login', Account.edit);


}
