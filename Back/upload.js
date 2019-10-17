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

const publicKey = 'ASIAV3K2QLFHQXKURKWC'; // Update the keys
const secretKey = 'Q/ZqD5ub21xRF7QWC04CS+YcYoY6TuuXn1O5OWAt';
const sessionToken = 'FQoGZXIvYXdzEJD//////////wEaDL5dqdl/LbWFst3s3yKWApSbbelVo6BTA5JcKYqY3TN/0v8mjhwv7NkAY9yu6R9AIY3wfwJpjqUlKC5kj7Z4q7H8UX+mVZ6TLDB+mymZtyRC8Hs75RZL1V1PfKHWZqJS0WqWDYN2aB/95ffwsHxiff99qu5I742JwKrBagme4PmXpPf+CMFZQVYPs60EKWC/eM1ij12T/aAWcGfdzQxGuegsitR/6GTxCYqQmetMSCq4EEQAyhWBN9sBeulobxi/TLbqfsHjAehbvnIan8HGyV/+aF0xr9MTbuDIgsGtCGD75CTbdMtVH7zwJ+ezmBqyegkD1KFkJizJV3paRaHrWNzn7pE2NNMhLwujGVzFKILu0DIVBLdqgFVk1HCEZjaSK/AFpT7lKKz+oe0F';

const GOOGLE_CLOUD_PROJECT_ID = ''; // Replace with your project ID
const GOOGLE_CLOUD_KEYFILE = ''; // Replace with the path to the downloaded private key


const s3 = new AWS.S3(
 {accessKeyId: publicKey, secretAccessKey: secretKey, sessionToken: sessionToken}
);
// const storage = new Storage({
//     projectId: GOOGLE_CLOUD_PROJECT_ID,
//     keyFilename: GOOGLE_CLOUD_KEYFILE,
//   });

app.post('/fileupload', function(req, res) {
    var fstream,responce=false;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        const params = {
          Bucket: 'cloudprashbucket',
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
});

app.listen(3004, () => {
  console.log('Server started');
});
