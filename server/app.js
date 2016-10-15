var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


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

app.post('/upload', function(req, res) {
    var exceltojson;
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    })
}); 

//Static Page
app.use(express.static('public'));

// Route inclusion
var base = require('./routes/base');

app.use('/', base);




app.listen(process.env.PORT || 3000, function(){
  console.log('listening on server 3000');
});
