'use strict';

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");
const { S3_BUCKET_NAME } = require("../config");

/* S3 API
To send a request, you:

Initiate client with configuration (e.g. credentials, region).
Initiate command with input parameters.
Call send operation on client with command object as input.
If you are using a custom http handler, you may call destroy() to close open connections. */


const REGION = "us-west-1"; //e.g. "us-east-1"
// Create S3 service object
const s3 = new S3Client({ region: REGION });

// bucket: arn:aws:s3:::sharebnb-photos-dlee
async function uploadToS3Bucket(file) {
  try {
    const data = await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: uuid(),
      Body: file.buffer
    }));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
  // console.log(s3);
  // let resp = s3.putObject(, function(err,data) {
  //   if(err) {
  //    console.log(err,err.stack);
  //   }
  //   else {
  //    console.log(data);
  //   }
};
module.exports = { uploadToS3Bucket };
