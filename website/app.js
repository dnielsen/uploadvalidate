require('dotenv').config();
var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

// view engine setup
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function (req, res) {
    res.render('index', { IP: process.env.API_IP, PORT: process.env.API_PORT });
});

module.exports = app;
