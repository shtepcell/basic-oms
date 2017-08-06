const Auth = require('./controllers/auth'),
    Account = require('./controllers/account'),
    City = require('./controllers/city'),
    ClientType = require('./controllers/clientType'),
    Provider = require('./controllers/provider'),
    Service = require('./controllers/service'),
    Client = require('./controllers/client'),
    Department = require('./controllers/departments');
    
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
    app.post('/profile/password', Account.selfPassEdit);

    // app.all('/admin/*', Auth.isAdmin);

    app.get('/admin/users', Account.getPage);


    app.get('/admin/users/add', Account.getPageCreate);
    app.post('/admin/users/add', Account.create);

    app.get('/admin/users/:login', Account.getOne);
    app.post('/admin/users/:login', Account.edit);
    app.post('/admin/users/:login/password', Account.passEdit);

    app.get('/admin/departments', Department.getAll);
    app.get('/admin/departments/create', Department.getPageCreate);
    app.post('/admin/departments/create', Department.create);

    app.get('/admin/departments/:id', Department.getOne);
    app.post('/admin/departments/:id', Department.edit);

    // .get(Department.get)
    // .delete(Department.delete);

    app.route('/admin/cities')
        .get(City.getPage)
        .delete(City.delete);

    app.post('/admin/cities/change', City.edit);
    app.post('/admin/cities/add', City.create);

    app.route('/admin/client-types')
        .get(ClientType.getPage)
        .delete(ClientType.delete);

    app.post('/admin/client-types/change', ClientType.edit);
    app.post('/admin/client-types/add', ClientType.create);

    app.route('/admin/providers')
        .get(Provider.getPage)
        .delete(Provider.delete);

    app.post('/admin/providers/change', Provider.edit);
    app.post('/admin/providers/add', Provider.create);

    app.route('/admin/services')
        .get(Service.getPage)
        .delete(Service.delete);

    app.post('/admin/services/change', Service.edit);
    app.post('/admin/services/add', Service.create);

    app.route('/admin/clients')
        .get(Client.getPage)
        .delete(Client.delete);

    app.post('/admin/clients/change', Client.edit);
    app.post('/admin/clients/add', Client.create);

}
