require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var benevoleRouter = require('./routes/benevole');
var eventRouter = require('./routes/evenement');
var assoRouter = require('./routes/association');

var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/benevole', benevoleRouter);
app.use('/event', eventRouter);
app.use('/asso', assoRouter);

module.exports = app;
