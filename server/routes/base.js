var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended:false}));

var router = express.Router();
var fs = require('fs-extra');
var rimraf = require('rimraf');
var pg = require('pg');
// var client = new pg.Client();
var client = new pg.Client();

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

router.get('/process', function(req, res){
  console.log("We are here in results");


  async.series([
      function(callback) {
          // DROP ALL PREVIOUS TABLES IF THEY EXIST
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ('DROP TABLE IF EXISTS goodgrocerdata, supervaludeals, results');
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'one');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
      },
      function(callback) {
          // CREATE SUPERVALUE TABLE
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ('CREATE TABLE supervaludeals (itemupc bigint, brand varchar, description varchar, pack integer, size varchar, mxdlwk varchar, mxdlamt float, mxdealprct decimal, basecasecost float, netcasecost float, netunitcost float, w1 decimal, w2 decimal, w3 decimal, w4 decimal, w5 decimal, w6 decimal, w7 decimal, w8 decimal, w9 decimal, w10 decimal, palletshipper varchar, msir varchar)');
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'two');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
              // res.send('we are the beasts of the world');
          // callback(null, 'two');
      },


      function(callback) {
          // CREATE GOOD GROCER TABLE
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ('CREATE TABLE goodgrocerdata (evo integer, descrptn varchar, addldsc varchar, upc bigint, dpt varchar, supervalu float, casevndr varchar, caseqty varchar, casecost varchar, unitcost float)');
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'three');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
              // res.send('we are the beasts of the world');
          // callback(null, 'two');
      },

      function(callback) {
          // COPY SUPERVALUE DATA TO TABLE
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ("COPY supervaludeals FROM '/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads/supervaludata.csv' DELIMITER ',' CSV");
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'four');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
              // res.send('we are the beasts of the world');
          // callback(null, 'two');
      },
      function(callback) {
          // COPY GOOD GROCER DATA
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ("COPY goodgrocerdata FROM '/Users/lukasudstuen/softwareProjects/groceryComparer/public/uploads/goodgrocerdata.csv' DELIMITER ',' CSV");
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'five');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
              // res.send('we are the beasts of the world');
          // callback(null, 'two');
      },

      function(callback) {
          // do some more stuff ...
          pg.connect(connectionString, function(err, client, done){
          var searchClient = ("SELECT * INTO results FROM supervaludeals, goodgrocerdata WHERE goodgrocerdata.upc = supervaludeals.itemupc ORDER BY mxdealprct DESC");
          var query = client.query(searchClient);
          query.on('end', function(){
            done();
            callback(null, 'six');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
      },


      function(callback) {
          // do some more stuff ...
          compiled_prices = [];

          pg.connect(connectionString, function(err, client, done){
          var searchClient = ("SELECT * FROM results;");
          var query = client.query(searchClient);
          query.on('row', function(row){
            compiled_prices.push(row);
          });
          query.on('end', function(){
            done();
            callback(null, 'seven');
            // res.send(compiled_prices)
            res.redirect('/success');
          });
          if(err){
            console.log('logging an err: ', err);
          }
          });
      },
  ],
  // optional callback
  function(err, results) {
        console.log("We have now received an error of: ", err);
        console.log("With the results of: ", results);
  });

});

router.get('/success', function(req, res){
  res.sendFile(path.resolve('public/views/success.html'))
});

router.get('/API', function (req, res){
  compiled_prices = [];

  pg.connect(connectionString, function(err, client, done){
  var searchClient = ("SELECT * FROM results;");
  var query = client.query(searchClient);
  query.on('row', function(row){
    compiled_prices.push(row);
  });
  query.on('end', function(){
    done();
    res.send(compiled_prices);
});
});
  });

module.exports = router;
