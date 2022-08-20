const Account = require("./controllers/account");
const Auth = require("./controllers/auth");
const Chat = require("./controllers/chat");
const City = require("./controllers/city");
const Client = require("./controllers/client");
const ClientType = require("./controllers/clientType");
const Configiration = require("./controllers/configuration");
const Department = require("./controllers/departments");
const helper = require("./controllers/helper");
const Holiday = require("./controllers/holiday");
const Notify = require("./controllers/notify");
const Order = require("./controllers/order");
const Provider = require("./controllers/provider");
const Street = require("./controllers/street");
const Mass = require("./controllers/mass");
const { getAnalytics } = require("./controllers/analytics");
const fileUpload = require("express-fileupload");
const {
  onlyInitiatorFilter,
  initiatorAndAdminFilter,
  privateOrder,
} = require("./middlewares/access");

var Render = require("./render"),
  render = Render.render;

module.exports = function (app, io) {
  app.use(fileUpload());
  app.get("/ping/", function (req, res) {
    res.send("ok");
  });

  app.get("/login", Auth.getLogin);
  app.post("/login", Auth.checkAuthorisation);

  app.all("*", Auth.isLoggedIn);

  app.get("*", async (req, res, next) => {
    res.locals.dataset = await helper.getData(res);
    next();
  });

  app.get("/logout", Auth.logout);

  app.get("/", function (req, res) {
    if (res.locals.__user.last) {
      res.redirect(res.locals.__user.last);
      return;
    }

    var redirect;

    switch (res.locals.__user.department.type) {
      case "gus":
      case "sks":
        redirect = "/pre";
        break;
      case "b2o":
      case "b2b":
        redirect = "/client";
        break;
      default:
        redirect = "/pre";
    }
    res.redirect(redirect);
    return;
  });

  app.get("/my", Order.getMainPageMy);
  app.get("/pause", Order.getMainPagePause);
  app.get("/client", Order.getMainPageClient);
  app.get("/pre", Order.getMainPagePre);
  app.get("/build", Order.getMainPageBuild);

  app.post("/settings/:tab", Account.settings);

  app.get("/status", Order.getStatPage);

  app.get("/search", Order.search);
  app.get("/search/reset", Order.searchReset);

  app.get("/export", Order.excel);
  app.get("/report", Order.report);

  app.get("/dev", function (req, res) {
    render(req, res, {
      viewName: "dev",
    });
  });
  // *************************************************************
  app.get("/init", onlyInitiatorFilter, Order.getPageInit);
  app.post("/init", onlyInitiatorFilter, (req, res) => {
    return Order.init(req, res);
  });

  // app.post('/order/:id', Order.submit);
  app.post("/order/:id/action", privateOrder, Order.changeStatus);

  app.get("/order/:id", privateOrder, Order.getOrderInfo);
  app.get("/order/:id/info", privateOrder, Order.getOrderInfo);
  app.get("/order/:id/gzp", privateOrder, Order.getOrderGZP);
  app.get("/order/:id/sks", privateOrder, Order.getOrderSKS);
  app.get("/order/:id/stop", privateOrder, Order.getOrderSTOP);
  app.get("/order/:id/history", privateOrder, Order.getOrderHistory);

  app.post("/order/:id/info", (req, res) => {
    return Order.endClientNotify(req, res);
  });

  app.post("/order/:id/gzp", Order.postGzp);

  app.get("/change-order/:id", Order.getPageChange);
  app.post("/change-order/:id", Order.getChangeV);

  app.post("/changeRespDep", Order.changeRespDep);
  app.post("/changeStage", Order.changeStage);

  // app.post('/order/:id/gzp', (req, res) => {
  //     return Order.endPreGZP(req, res, io);
  // });

  app.post("/order/:id/stop", (req, res) => {
    return Order.endPreSTOP(req, res);
  });

  app.post("/order/:id/sks", (req, res) => {
    return Order.endPreSKS(req, res);
  });

  app.post("/order/:id/:tab/admin", (req, res) => {
    return Order.adminEdit(req, res);
  });
  app.post("/flag/:id/", Order.setFlag);

  app.get("/chat/:anchor", Chat.get);
  app.post("/chat/:anchor", (req, res) => {
    return Chat.send(req, res, io);
  });

  app.get("/profile", Account.getProfile);
  app.post("/profile", Account.selfEdit);
  app.post("/profile/password", Account.selfPassEdit);

  app.get("/notifies", Notify.get);

  app.post("/notifies/:id", Notify.read);

  app.get("/admin/clients", initiatorAndAdminFilter, Client.getPage);
  app.delete("/admin/clients", initiatorAndAdminFilter, Client.delete);
  app.post("/admin/clients/change", initiatorAndAdminFilter, Client.edit);
  app.post("/admin/clients/add", initiatorAndAdminFilter, Client.create);

  app.get("/admin/cities", City.getPage);
  app.get("/admin/providers", Provider.getPage);

  app.all("/admin/*", Auth.isAdmin);
  app.all("/v2/admin/*", Auth.isAdmin);

  app.get("/admin/users", Account.getPage);

  app.get("/admin/holiday", Holiday.getAll);
  app.post("/admin/holiday", Holiday.add);
  app.post("/admin/holiday/delete", Holiday.delete);

  app.get("/admin/users/add", Account.getPageCreate);
  app.post("/admin/users/add", Account.create);

  app.get("/admin/users/:login", Account.getOne);
  app.post("/admin/users/:login", Account.edit);
  app.post("/admin/users/:login/delete", Account.delete);
  app.post("/admin/users/:login/password", Account.passEdit);

  app.get("/admin/departments", Department.getAll);
  app.get("/admin/departments/create", Department.getPageCreate);
  app.post("/admin/departments/create", Department.create);

  app.get("/admin/departments/:id", Department.getOne);
  app.get("/v2/admin/departments/:id", Department.getOneMiddleware);
  app.post("/admin/departments/:id", Department.edit);
  app.post("/admin/departments/:id/city", Department.addCity);
  app.post("/admin/departments/:id/delete", Department.delete);
  app.post("/admin/departments/:id/delete/:city", Department.deleteCity);

  app.route("/admin/street").get(Street.getPage).delete(Street.delete);

  app.post("/admin/street/change", Street.edit);
  app.post("/admin/street/add", Street.create);

  app.delete("/admin/cities", City.delete);

  app.post("/admin/cities/change", City.edit);
  app.post("/admin/cities/add", City.create);

  app
    .route("/admin/client-types")
    .get(ClientType.getPage)
    .delete(ClientType.delete);

  app.post("/admin/client-types/change", ClientType.edit);
  app.post("/admin/client-types/add", ClientType.create);

  app.delete("/admin/providers", Provider.delete);
  app.post("/admin/providers/change", Provider.edit);
  app.post("/admin/providers/add", Provider.create);

  app.get("/admin/configuration", Configiration.getConfigurationPage);
  app.post(
    "/api/admin/configuration",
    Auth.isAdmin,
    Configiration.updateConfiguration
  );

  app.get("/test/", (req, res) => {
    const access = req.query.access == "yes";

    render(req, res, {
      viewName: "testServices",
      options: {
        access: access,
      },
    });
  });

  app.get("/api/requests", Mass.getOwnRequestsApi);
  app.post("/api/mass", Mass.makeRequestToChange);
  app.post("/api/mass/upload", Mass.validateOrders);
  app.post("/api/mass/import", Mass.importOrders);
  app.patch("/api/mass/:id", Mass.updateRequest);

  app.get("/api/admin/department/:id", Department.api.getOne);
  app.post("/api/admin/department/:id/city", Department.api.addCity);
  app.delete(
    "/api/admin/department/:id/city/:cityId",
    Department.api.removeCity
  );

  app.get("/api/admin/unused-cities", City.api.getUnused);

  app.post(
    "/api/order/:id/priority",
    initiatorAndAdminFilter,
    Order.api.setPriority
  );

  app.get("/api/analytics/", getAnalytics);
};
