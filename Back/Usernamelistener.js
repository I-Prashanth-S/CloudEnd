var express = require('express');
var app = express();
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var busboy = require('connect-busboy');
const AWS = require('aws-sdk');
const {Storage} = require('@google-cloud/storage');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(busboy());

const validnumber = RegExp((/^[0-9]+$/));
const validletter = RegExp((/^[A-Za-z]+$/));
const publicKey = ''; // Update the keys
const secretKey = '';
const sessionToken = '';

const GOOGLE_CLOUD_PROJECT_ID = ''; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = ''; // Replace with the path to the downloaded private key

const s3 = new AWS.S3(
 {accessKeyId: publicKey, secretAccessKey: secretKey, sessionToken: sessionToken}
);
// const storage = new Storage({
//     projectId: GOOGLE_CLOUD_PROJECT_ID,
//     keyFilename: GOOGLE_CLOUD_KEYFILE,
//   });

var con = mysql.createConnection({
  host: "", user: "",
  password: "",
  port: "3306",
  database: "innodb"
});
var todaysDate = new Date();

app.post('/', function(req , res){
  if((req.body.productname==="")||(req.body.zipcode==="")||(req.body.phone==="")){
    res.send("false");
  }
  else{
    fs.appendFile('mynamefile.txt',JSON.stringify(req.body),function (err){
      if (err) throw err;
      console.log('saved!!!');
    });
    if(req.body.zipcode=='90210'){
      con.query("insert into product values(?,?,?,?)", [req.body.productname,req.body.zipcode,req.body.phone,"Beverly Hills"],function (err, result) {
        console.log("Database created");
        console.log(result);
      });
    }
    if(req.body.zipcode=='94016'){
      con.query("insert into product values(?,?,?,?)", [req.body.productname,req.body.zipcode,req.body.phone,"Daly City"],function (err, result) {
        console.log("Database created");
        console.log(result);
      });
    }
    if(req.body.zipcode=='10001'){
      con.query("insert into product values(?,?,?,?)", [req.body.productname,req.body.zipcode,req.body.phone,"New York"],function (err, result) {
        console.log("Database created");
        console.log(result);
      });
    }
    if(req.body.zipcode=='14201'){
      con.query("insert into product values(?,?,?,?)", [req.body.productname,req.body.zipcode,req.body.phone,"Buffalo"],function (err, result) {
        console.log("Database created");
        console.log(result);
      });
    }
    res.send('true');
  }
})

app.post('/letters',function(req , res){
  res.send(validletter.test(req.body.val)?"true":"false")
})

app.post('/numbers',function(req , res){
  res.send(validnumber.test(req.body.val)?"true":"false")
})
app.post('/zip',function(req , res){
  res.send(validnumber.test(req.body.val)&&(req.body.val.length==5)?"true":"false")
})
app.post('/checkcountry',function(req , res){
  res.send(req.body.val=="Select a Country"?"false":"true")
})
app.post('/checkstate',function(req , res){
  res.send(req.body.val=="Select a State"?"false":"true")
})
app.post('/checkdays',function(req , res){
  res.send((req.body.val<30)&&(req.body.val>=0)&&(validnumber.test(req.body.val))?"true":"false")
})
app.post('/checkdate',function(req , res){

  res.send(new Date(req.body.val)<todaysDate?"true":"false")
})
app.post('/fileupload', function(req, res) {
    var fstream,responce=false;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        const params = {
          Bucket: '',
          Key: (filename),
          Body: file
        };
        // fstream = fs.createWriteStream(filename);
        // file.pipe(fstream);
        s3.upload(params, function(s3Err, data) {
          if (s3Err) {
              console.log("Error uploading data: ", s3Err);
            } else {
              console.log("Successfully uploaded data");
            }
        });
        // storage.bucket('yogesh5466').upload(filename,function(s3Err, data) {
        //   if (s3Err) {
        //       console.log("Error uploading data: ", s3Err);
        //     } else {
        //       console.log("Successfully uploaded data");
        //     }
        //   });
        responce=true;
    });
    req.busboy.on('finish', function () {
        res.send(responce);
    });

})
app.post('/checkfile',function(req , res){
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      console.log(filename);
      res.send(true);
  });
  req.busboy.on('finish', function () {
      res.send(false);
  });

})


//start your server on port 3001
app.listen(3001, () => {
  console.log('Server started');
});
