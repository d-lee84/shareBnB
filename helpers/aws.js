'use strict';

import { S3Client } from "@aws-sdk/client-s3";
import {v4 as uuid} from "uuid";
import {ACCESS_KEY,AWS_SECRET_KEY, S3_BUCKET_NAME} from "../config";

/* S3 API
To send a request, you:

Initiate client with configuration (e.g. credentials, region).
Initiate command with input parameters.
Call send operation on client with command object as input.
If you are using a custom http handler, you may call destroy() to close open connections. */

const config = {
  accessKeyId: ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
  region: "us-west-1"
}
const s3 = new S3Client({config});

// bucket: arn:aws:s3:::sharebnb-photos-dlee
function uploadToS3Bucket(file) {
  s3.putObject({
    Bucket: S3_BUCKET_NAME,
    Key: uuid(),
    Body: file
    // ContentType: contentType
  });

}
module.exports = {uploadToS3Bucket};
