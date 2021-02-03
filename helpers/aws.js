'use strict';

import { S3Client } from "@aws-sdk/client-s3";
import {v4 as uuid} from "uuid";

const s3 = new S3Client({ region: "us-west-1" });



function uploadToS3Bucket() {
  s3.putObject({
    Bucket: "arn:aws:s3:::sharebnb-photos-dlee",
    Key: uuid(),
    Body: body,
    ContentType: contentType
})
}