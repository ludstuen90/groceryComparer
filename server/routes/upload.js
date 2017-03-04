var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var xlsxtojson = require("xlsx-to-json-lc");
var xlstojson = require("xls-to-json-lc");
var xlsx = require("xlsx");
var async = require("async");


app.use(express.static('public'));


// This section below includes all logic necessary to upload files

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
      cb(null, req.params.filename+ '.' +file.originalname.split('.')[file.originalname.split('.').length -1]);

  }
});

var upload = multer({ //multer settings
                  storage: storage,
                  fileFilter : function(req, file, callback) { //file filter
                      if (['csv'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                          return callback(new Error('Wrong extension type'));
                      }
                      callback(null, true);
                  }
              }).single('file');
// We have abstracted some logic into the fileUpload function so that we can save two different files with different names.
var fileUpload = function(req, res, filename) {
  upload(req,res,function(err){
           if(err){
                res.json({error_code:1,err_desc: err + ". Sorry, your filed could not be uploaded. Please, try again. ", });
                return;
           }
           /** Multer gives us file info in req.file object */
           else if (!req.file){
               res.json({error_code:1,err_desc:"No file passed"});
               return;
           }
         });
}

router.post('/1', function(req, res) {
  async.series([
      function(callback) {
          // do some stuff ...
          req.params.filename = 'supervaludata';
          fileUpload(req, res)
          callback(null, 'one');
      },
      function(callback) {
          // do some more stuff ...
              res.redirect('/upload2view');
          callback(null, 'two');
      }
  ],
  // optional callback
  function(err, results) {
      // results is now equal to ['one', 'two']
        console.log("We have now received an error of: ", err);
        console.log("With the results of: ", results);
  });
});

router.post('/2', function(req, res) {
    async.series([
        function(callback) {
            // do some stuff ...
            req.params.filename = 'goodgrocerdata';
            fileUpload(req, res)
            callback(null, 'one');
        },
        function(callback) {
            // do some more stuff ...
                res.redirect('/success');
            callback(null, 'two');
        }
    ],
    // optional callback
    function(err, results) {
        // results is now equal to ['one', 'two']
          console.log("We have now received an error of: ", err);
          console.log("With the results of: ", results);
    });
});

module.exports = router;
