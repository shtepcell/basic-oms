const Auth = require('./controllers/auth');
const Account = require('./controllers/account');
const City = require('./controllers/city');

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
        render(req, res, 'add_account');
    });

    app.get('/admin/cities', City.getAll);

    app.delete('/admin/cities/delete', City.delete);

}
