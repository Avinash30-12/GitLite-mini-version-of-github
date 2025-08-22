const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1", // your bucket’s region
});

const S3_BUCKET = "myapnabucketavi";

module.exports = { s3, S3_BUCKET };
