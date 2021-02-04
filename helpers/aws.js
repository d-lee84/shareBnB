'use strict';

const { S3Client, PutObjectCommand  } = require("@aws-sdk/client-s3");
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



async function uploadToS3Bucket(file) {
  const key = uuid();
  try {
    const data = await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: "image/jpeg",
      Tagging: "public=yes"
    }));
    console.log("Success", data);
  } catch (err) {
    console.log("Error", err);
  }
  return `https://${S3_BUCKET_NAME}.s3-us-west-1.amazonaws.com/${key}`
};
module.exports = { uploadToS3Bucket };
