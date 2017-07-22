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

    app.get('/profile', Account.getProfile);
    app.post('/profile', Account.selfEdit);
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


    app.route('/admin/cities')
        .get(City.getPage)
        .delete(City.delete);

    app.post('/admin/cities/change', City.edit);
    app.post('/admin/cities/add', City.create);
}
