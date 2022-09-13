Object.assign || (Object.assign = require("object-assign"));
require("dotenv").config();

const moment = require("moment");
const nextJs = require("next");
const Mass = require("./controllers/mass");

var fs = require("fs"),
    path = require("path"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    favicon = require("serve-favicon"),
    morgan = require("morgan"),
    serveStatic = require("serve-static"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    passport = require("passport"),
    compression = require("compression"),
    logger = require("./controllers/logger"),
    config = require("./config"),
    staticFolder = config.staticFolder,
    Render = require("./render"),
    render = Render.render,
    port = process.env.SERVER_PORT || 3000,
    isSocket = isNaN(port),
    isDev = process.env.NODE_ENV !== "production",
    mongoose = require("./controllers/connect"),
    MongoStore = require("connect-mongo")(expressSession),
    helper = require("./controllers/helper"),
    router = require("./router");

require("debug-http")();

const nextApp = nextJs({ dev: isDev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});

morgan.token("date", function () {
    var p = helper.dateToExtStr(new Date());
    return p;
});

morgan.token("user", function (req, res) {
    if (res.locals.__user) {
        return res.locals.__user.login;
    } else {
        return "guest";
    }
});

morgan.token("smart-url", function (req, res) {
    if (req.originalUrl.length > 90) {
        return (
            req.originalUrl.substring(0, 70) +
            ".-.-.-." +
            req.originalUrl.substring(
                req.originalUrl.length - 20,
                req.originalUrl.length
            )
        );
    }
    return req.originalUrl;
});

app.use((req, res, next) => {
    const company = req.hostname === process.env.PROJECT_HOST ? "m" : "t";

    res.locals.company = company;
    next();
});

app.disable("x-powered-by")
    .enable("trust proxy")
    .use(compression())
    .use((req, res, next) =>
        favicon(path.join(staticFolder, `favicon-${res.locals.company}.ico`))(
            req,
            res,
            next
        )
    )
    .use(serveStatic(staticFolder))
    .use(
        morgan(
            "[HTTP] :date[web] <:user> :method :smart-url :status :res[header] - :response-time ms"
        )
    )
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(
        expressSession({
            name: process.env.DATABASE_NAME,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 14 * 24 * 60 * 60 * 1000, // 2 недели
            },
            unset: "destroy",
            secret: "s562hdnYsd52nSBN",
            // secret: secretConf.secret,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                autoRemove: "native",
                ttl: 14 * 24 * 60 * 60,
                touchAfter: 10 * 60,
                stringify: true,
            }),
        })
    )
    .use(passport.initialize())
    .use(passport.session());

// NOTE: conflicts with livereload
// isDev || app.use(slashes());

passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function (user, done) {
    done(null, JSON.parse(user));
});

var server = require("http").createServer(app);

var io = require("socket.io")(server);

process.on("unhandledRejection", (error) => {
    const time = moment().format("DD.MM.YYYY HH:mm:ss");

    console.log(`${time} – unhandledRejection`, error);
});

router(app, io);

app.get("/mass", Mass.getOwnRequestsMiddleware, handle);
app.get("*", handle);

isDev && require("./rebuild")(app);

app.get("*", function (req, res) {
    res.status(404);
    return render(req, res, { view: "404" });
});

if (isDev) {
    app.get("/error/", function () {
        throw new Error("Uncaught exception from /error");
    });

    app.use(require("errorhandler")());
}

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

server.listen(port, function () {
    isSocket && fs.chmod(port, "0777");
    console.log(
        `\n  ################## RELOAD SERVER - ${helper.dateToExtStr()} ################### \n`
    );
    logger.info(`Server is listening on ${this.address().port}`);
});
