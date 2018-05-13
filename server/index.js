Object.assign || (Object.assign = require('object-assign'));

var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    slashes = require('connect-slashes'),
    passport = require('passport'),
    // LocalStrategy = require('passport-local').Strategy,
    csrf = require('csurf'),
    compression = require('compression'),
    logger = require('./controllers/logger'),
    config = require('./config'),
    staticFolder = config.staticFolder,

    Render = require('./render'),
    render = Render.render,
    dropCache = Render.dropCache, // eslint-disable-line no-unused-vars

    port = process.env.PORT || config.defaultPort,
    isSocket = isNaN(port),
    isDev = process.env.NODE_ENV === 'development',

    MongoStore = require('connect-mongo')(expressSession),
    mongoose = require('./controllers/connect'),

    helper = require('./controllers/helper'),
    router = require('./router'),

    db = require('./controllers/connect').connections[0];

require('debug-http')();

morgan.token('date', function() {
    var p = helper.dateToExtStr(new Date());
    return p;
});

morgan.token('user', function(req, res) {
    if(res.locals.__user)
        return res.locals.__user.login;
    else return 'guest'
});

morgan.token('smart-url', function(req, res) {
    if(req.originalUrl.length > 90) return req.originalUrl.substring(0, 70) + '.-.-.-.' + req.originalUrl.substring(req.originalUrl.length-20, req.originalUrl.length);
    return req.originalUrl;
});

app
    .disable('x-powered-by')
    .enable('trust proxy')
    .use(compression())
    .use(favicon(path.join(staticFolder, 'favicon.ico')))
    .use(serveStatic(staticFolder))
    .use(morgan('[HTTP] :date[web] <:user> :method :smart-url :status :res[header] - :response-time ms'))
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(expressSession({
        name: 'basic-oms',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000 // 2 недели
        },
        unset: 'destroy',
        secret: 's562hdnYsd52nSBN',
        // secret: secretConf.secret,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            autoRemove: 'native',
            ttl: 14 * 24 * 60 * 60,
            touchAfter: 10 * 60,
            stringify: true
        })
    }))
    .use(passport.initialize())
    .use(passport.session())
    // .use(csrf());


// NOTE: conflicts with livereload
isDev || app.use(slashes());

passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
});

router(app);

isDev && require('./rebuild')(app);

app.get('*', function(req, res) {
    res.status(404);
    return render(req, res, { view: '404' });
});

if (isDev) {
    app.get('/error/', function() {
        throw new Error('Uncaught exception from /error');
    });

    app.use(require('errorhandler')());
}

isSocket && fs.existsSync(port) && fs.unlinkSync(port);

app.listen(port, function() {
    isSocket && fs.chmod(port, '0777');
    console.log(`\n  ################## RELOAD SERVER - ${helper.dateToExtStr()} ################### \n`);
    logger.info(`Server is listening on ${this.address().port}`);
});
