"use strict";

const Account = require("../models/Account");
const Department = require("../models/Department");
const Order = require("../models/Order");
const password = require("./password");
const logger = require("./logger");
const Render = require("../render");
const render = Render.render;

const FAKE_AUTH_KEY = "fake-auth";

module.exports = {
  getLogin: async (req, res) => {
    if (req.session.__user) {
      res.redirect("/");
    } else {
      render(req, res, { viewName: "login" });
    }
  },

  isLoggedIn: async (req, res, next) => {
    if (req.session.__user) {
      var acc = await Account.findOne({ login: req.session.__user }).populate(
        "department notifies"
      );

      acc.firstVisit = acc.firstVisit || new Date();
      acc.lastVisit = new Date();
      acc.save().catch((err) => {
        console.error(
          `Visit information for ${acc.login} can't save, cause: ${err}`
        );
      });

      var deps = await Department.find({ status: true, type: "gus" }).lean();
      var requestPause;

      if (acc.department.type == "b2o" || acc.department.type == "b2b") {
        requestPause = await Order.count({
          "requestPause.status": true,
          "info.initiator": acc._id + "",
        });
      }

      if (
        (acc.department.type === "admin" && req.query.fakeAuth) ||
        req.cookies[FAKE_AUTH_KEY]
      ) {
        const fakeAuth = await Account.findOne({
          login: req.query.fakeAuth || req.cookies[FAKE_AUTH_KEY],
        }).populate("department notifies");

        if (!fakeAuth) {
          console.error("FakeAuth Error");
          return res.sendStatus(400);
        }

        req.query.fakeAuth && res.cookie(FAKE_AUTH_KEY, req.query.fakeAuth);

        acc = fakeAuth;
      }

      var count = 0;

      for (var i = 0; i < acc.notifies.length; i++) {
        if (acc.notifies[i].read.indexOf(acc._id) < 0) count++;
      }

      res.locals.__deps = deps;
      res.locals.__user = {
        _id: acc._id,
        login: acc.login,
        name: acc.name,
        department: acc.department,
        notifies: count,
        last: acc.last,
        settings: acc.settings,
        request: requestPause,
        access: acc.access.length === 0 ? ["none"] : acc.access,
      };

      next();
    } else {
      if (req.path != "/login") {
        res.locals.trg = "/login?trg=" + encodeURIComponent(req.originalUrl);
      }
      render(req, res, {
        viewName: "login",
      });
    }
  },

  isAdmin: function (req, res, next) {
    if (res.locals.__user.department.type == "admin") next();
    else res.status(403).send("Доступ только для администраторов");
  },

  logout: function (req, res) {
    req.session.destroy();
    res.redirect("/");
  },

  getUser: async (req, res) => {
    if (!req.session.__user) {
      return res.status(401).json({});
    }

    const user = await Account.findOne({ login: req.session.__user })
      .select("login name department access")
      .populate({ path: "department", select: "name type" });

    return res.json(user);
  },

  checkAuthorisation: async (req, res) => {
    const accQuery = {
      login: req.body.login,
      status: true,
    };

    accQuery.password = password.createHash(req.body.password);

    const acc = await Account.findOne(accQuery);

    if (acc) {
      req.session.__user = acc.login;
      logger.info(`Success authorization by : ${acc.login}`);
      var url = req.query.trg || "/";
      res.redirect(url);
    } else {
      logger.warn(`Fail authorization.`);
      res.status(401).redirect(req.originalUrl);
    }
  },
};
