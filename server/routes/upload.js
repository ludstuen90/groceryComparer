var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var xlsxtojson = require("xlsx-to-json-lc");
var xlstojson = require("xls-to-json-lc");

app.use(express.static('public'));

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

router.post('/1', function(req, res) {
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
                output: './public/uploads/1.json', //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                // res.json({error_code:0,err_desc:null, data: result});
                console.log('we made it here, all is swell.');
                res.redirect('/upload2view');
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    });
});

router.get('/3', function(req, res){
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile('test.xlsx');
  /* DO SOMETHING WITH workbook HERE */

  var sheet_name_list = workbook.SheetNames;
sheet_name_list.forEach(function(y) { /* iterate through sheets */
  var worksheet = workbook.Sheets[y];

  var testExample =  XLSX.utils.sheet_to_json(workbook.Sheets["Lowest Unit Cost 4 Weeks Out"]);
  res.send(testExample);
  res.end();



  // CODE WITHIN THIS SECTION MIGHT NOT WORK, KEEP ALL THE SAME //

  var test = "";

  for (var z in worksheet) {
    /* all keys that do not begin with "!" correspond to cell addresses */
    if(z[0] === '!') {
      test += ',BLANKROW,';
    }
    else {
      //  test += ( worksheet[z].v);
      //  test += (y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
      test += (y + "!" + z + "=" + worksheet[z].v);
      // console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
      // console.log(test[0]);
      // res.send(test);

    }

  }
  // res.json(JSON.stringify(test));


// END CODE THAT WON'T WORK



});






});


router.post('/2', function(req, res) {
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
                output: './public/uploads/2.json', //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                res.redirect('/success');
            });
        } catch (e){
            res.json({error_code:1,err_desc:"Corupted excel file"});
        }
    });
});

module.exports = router;
