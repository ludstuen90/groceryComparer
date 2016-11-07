var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');


router.get('/', function (req, res){
  res.sendFile(path.resolve('public/views/index.html'));
});

router.get('/upload2view', function(req, res){
  res.sendFile(path.resolve('public/views/upload2.html'));
});

router.get('/success', function(req, res){
  res.sendFile(path.resolve('public/views/success.html'));
});

router.get('/1', function(req, res){
  res.sendFile(path.resolve('public/uploads/1.json'));
});

router.get('/2', function(req, res){
  res.sendFile(path.resolve('public/uploads/2.json'));
});




module.exports = router;
