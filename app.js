var express = require('express');
var orm = require('orm');
var config = require('./config');
var models = require('./lib/models');
var session = require('express-session');
var bodyParser = require('body-parser');
var login_middleware = require('./lib/middleware').login_middleware;
var app = express();
var mysql = config.mysql;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'tokunejane',
    resave            : true,
    saveUninitialized : true
}))
app.use(login_middleware);
app.use(
    orm.express(
        "mysql://"+mysql.user+":"+mysql.password+"@"+mysql.host+"/"+mysql.db, 
        models
    )   
);

require('./lib/index').route(app);
require('./lib/diary').route(app);

app.listen(config.port);
