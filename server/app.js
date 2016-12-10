var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var xlsxtojson = require("xlsx-to-json-lc");
var xlstojson = require("xls-to-json-lc");
var fs = require('fs-extra');
var rimraf = require('rimraf');
var async = require('async');

app.use(bodyParser.json());

//Static Page
app.use(express.static('public'));

// Route inclusion
var base = require('./routes/base');
var upload = require('./routes/upload');

app.use('/', base);
app.use('/upload', upload);

app.listen(process.env.PORT || 3000, function(){
  console.log('listening on server 3000');
});
