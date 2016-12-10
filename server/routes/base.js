var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs-extra');
var rimraf = require('rimraf');

var async = require('async');




router.get('/', function (req, res){
  res.sendFile(path.resolve('public/views/index.html'));
});


router.get('/upload1view', function(req, res) {

  async.series([
    function(callback){
          var dataPath = ('/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads');
          rimraf(dataPath, function(error){
            console.log('Error: ', error);
            callback();
          });
    },
    function(callback) {
      fs.mkdirsSync('/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads');
    // res.sendStatus(200);
    callback();
  },
  function(callback) {
    res.sendFile(path.resolve('public/views/upload1.html'));
    callback();
  }
  ]);

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




router.get('/clearFiles', function(req, res) {

async.series([
  function(callback){
        var dataPath = ('/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads');
        rimraf(dataPath, function(error){
          console.log('Error: ', error);
          callback();
        });
  },
  function(callback) {
    fs.mkdirsSync('/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads');
  // res.sendStatus(200);
},
function(callback) {
  res.sendStatus(200);
  callback();
}
]);

});






module.exports = router;
