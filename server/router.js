const Auth = require('./controllers/auth'),
    Account = require('./controllers/account'),
    City = require('./controllers/city'),
    ClientType = require('./controllers/clientType'),
    Provider = require('./controllers/provider'),
    Service = require('./controllers/service'),
    Client = require('./controllers/client'),
    Department = require('./controllers/departments'),
    Order = require('./controllers/order'),
    Holiday = require('./controllers/holiday')
    Notify = require('./controllers/notify');

const fileUpload = require('express-fileupload');
const mkdirp = require('mkdirp-promise');

var Render = require('./render'),
    render = Render.render;

module.exports = function (app) {

    app.use(fileUpload());
    app.get('/ping/', function(req, res) {
        res.send('ok');
    });

    app.get('/login', Auth.getLogin);
    app.post('/login', Auth.checkAuthorisation);

    app.all('*', Auth.isLoggedIn);

    app.get('/logout', Auth.logout);

    app.get('/', Order.getMainPage);

    app.get('/status', Order.getStat);

    app.get('/search', Order.search);
    app.get('/search/reset', Order.searchReset);

    app.get('/dev', function (req, res) {
        render(req, res, {
            viewName: 'dev'
        })
    })
    // *************************************************************
    app.get('/init', Order.getPageInit);
    app.post('/init', Order.init);

    app.get('/order/:id', function (req, res) {
        res.redirect(`/order/${req.params.id}/info`)
    });

    // app.post('/order/:id', Order.submit);
    app.post('/order/:id/action', Order.changeStatus)

    app.get('/order/:id/info', Order.getOrderInfo);
    app.get('/order/:id/gzp', Order.getOrderGZP);
    app.get('/order/:id/stop', Order.getOrderSTOP);
    app.get('/order/:id/history', Order.getOrderHistory);
    app.get('/order/:id/file/:file', Order.getFile);

    app.post('/order/:id/info', Order.endClientNotify);
    app.post('/order/:id/gzp', Order.endPreGZP);
    app.post('/order/:id/stop', Order.endPreSTOP);

    app.post('/order/:id/:tab/admin', Order.adminEdit);

    app.get('/profile', Account.getProfile);
    app.post('/profile', Account.selfEdit);
    app.post('/profile/password', Account.selfPassEdit);

    app.get('/notifies', Notify.get);
    app.post('/notifies/:id', Notify.read);

    app.all('/admin/*', Auth.isAdmin);

    app.get('/admin/users', Account.getPage);

    app.get('/admin/holiday', Holiday.getAll);
    app.post('/admin/holiday', Holiday.add);
    app.post('/admin/holiday/delete', Holiday.delete);

    app.get('/admin/users/add', Account.getPageCreate);
    app.post('/admin/users/add', Account.create);

    app.get('/admin/users/:login', Account.getOne);
    app.post('/admin/users/:login', Account.edit);
    app.post('/admin/users/:login/delete', Account.delete);
    app.post('/admin/users/:login/password', Account.passEdit);

    app.get('/admin/departments', Department.getAll);
    app.get('/admin/departments/create', Department.getPageCreate);
    app.post('/admin/departments/create', Department.create);

    app.get('/admin/departments/:id', Department.getOne);
    app.post('/admin/departments/:id', Department.edit);
    app.post('/admin/departments/:id/city', Department.addCity);
    app.post('/admin/departments/:id/delete', Department.delete);
    app.post('/admin/departments/:id/delete/:city', Department.deleteCity);


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
