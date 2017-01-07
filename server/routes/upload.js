var path = require('path');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var xlsxtojson = require("xlsx-to-json-lc");
var xlstojson = require("xls-to-json-lc");
var xlsx = require("xlsx");

app.use(express.static('public'));

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, 'upload.'+file.originalname.split('.')[file.originalname.split('.').length -1]);
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

  console.log('just about to upload a file at ', Date.now());
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

      if(typeof require !== 'undefined') XLSX = require('xlsx');
        var workbook = XLSX.readFile('./public/uploads/upload.xlsx');
        // console.log(workbook)
        var sheet_name_list = workbook.SheetNames;
        // console.log('the sheet name list is ', sheet_name_list[0]);

        //Capture all values in the workbook
        var information = workbook.Sheets[sheet_name_list[0]];
        // console.log(information);
        var capturedInfo = []
        for (z in information){
          capturedInfo += information[z].v;
          capturedInfo += ' , ';

        };

          // STOPPING POINT FOR TODAY -- CANNOT SAVE CSV VERSION OF EXCEL. CAN WRITE THOUGH
        var writeMe = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name_list[0]]);
        console.log('write me is ', writeMe);
        XLSX.writeFile(writeMe, './public/uploads/out.csv');
        //



      res.redirect('/upload2view');
    });

});

    // var exceltojson;
    // upload(req,res,function(err){
    //     if(err){
    //          res.json({error_code:1,err_desc:err});
    //          return;
    //     }
    //     /** Multer gives us file info in req.file object */
    //     if(!req.file){
    //         res.json({error_code:1,err_desc:"No file passed"});
    //         return;
    //     }
    //     /** Check the extension of the incoming file and
    //      *  use the appropriate module
    //      */
    //     if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
    //         exceltojson = xlsxtojson;
    //     } else {
    //         exceltojson = xlstojson;
    //     }
    //     try {
    //         exceltojson({
    //             input: req.file.path,
    //             output: './public/uploads/1.json', //since we don't need output.json
    //             lowerCaseHeaders:true
    //         }, function(err,result){
    //             if(err) {
    //                 return res.json({error_code:1,err_desc:err, data: null});
    //             }
    //             // res.json({error_code:0,err_desc:null, data: result});
    //             console.log('we made it here, all is swell.');
    //             res.redirect('/upload2view');
    //         });
    //     } catch (e){
    //         res.json({error_code:1,err_desc:"Corupted excel file"});
    //     }
    // });
// });


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
