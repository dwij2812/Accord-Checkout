var path = require('path');
var express = require('express');
var cors = require('cors');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session.maxAge
    },
    store: new MongoStore({
        url: config.mongodb
    })
}));
app.use(flash());
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),
    keepExtensions: true
}));

app.locals.blog = {
    title: 'Accord CheckOut'
};

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

routes(app);

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));


app.use(function (err, req, res, next) {
    res.render('error', {
        error: err
    });
});
app.listen(config.port, function () {
    console.log(`${pkg.name} is listening on PORT: ${config.port}`);
});
