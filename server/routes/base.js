var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs-extra');
var rimraf = require('rimraf');
var pg = require('pg');

var async = require('async');


if(process.env.DATABASE_URL !== undefined) {
     console.log('env connection string');
     connectionString = process.env.DATABASE_URL;
     pg.defaults.ssl = true;
} else {
    // running locally, use our local database instead
    connectionString = 'postgres://localhost:5432/groc';
}



router.get('/', function (req, res){
  res.sendFile(path.resolve('public/views/index.html'));
});

router.get('/upload1view', function(req, res) {
  async.series([
    function(callback){
        // Deletes the uploads file direcotry. This executes whenever a new upload page 1 is loaded
          var dataPath = ('/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads');
          rimraf(dataPath, function(error){
            console.log('Error: ', error);
            callback();
          });
    },
    function(callback) {
      // Creates a new uploads directory
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

  pg.connect(connectionString, function(err, client, done){
    // This is the query that is creating all the problems. Will need to edit this. 
    // client.query("CREATE TABLE supervaludeals (itemupc bigint, brand varchar, description varchar, pack integer, size varchar, mxdlwk varchar, mxdlamt float, mxdealprct decimal, basecasecost float, netcasecost float, netunitcost float, w1 decimal, w2 decimal, w3 decimal, w4 decimal, w5 decimal, w6 decimal, w7 decimal, w8 decimal, w9 decimal, w10 decimal, palletshipper varchar, msir varchar)");

    done();
    pg.end();

  });
  res.sendFile(path.resolve('public/views/success.html'));
});


module.exports = router;
