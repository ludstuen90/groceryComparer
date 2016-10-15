var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
app.use(bodyParser.json());
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
});
var upload = multer({ //multer settings
                  storage: storage,
                  fileFilter : function(req, file, callback) { //file filter
                      if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                          return callback(new Error('Wrong extension type'));
                      }
                      callback(null, true);
                  }
              }).single('file');
/** API Path that will accept uploaded files**/

app.post('/upload', function(req, res){
  upload(req, res, function(err){
    if (err) {
      res.json({error_code:1, err_desc:err});
      return;
    }
    res.json({error_code:0, err_desc:null});
  });
});

//Static Page
app.use(express.static('public'));

// Route inclusion
var base = require('./routes/base');

app.use('/', base);




app.listen(process.env.PORT || 3000, function(){
  console.log('listening on server 3000');
});
