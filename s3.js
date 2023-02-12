const S3=require("aws-sdk/clients/s3");
require("dotenv").config();
const fs=require("fs");

const awsBucketName=process.env.AWS_BUCKET_NAME
const awsBucketRegion=process.env.AWS_BUCKET_REGION
const awsAccessKey=process.env.AWS_ACCESS_KEY
const awsSecretAccessKey=process.env.AWS_SECRET_ACCESS_KEY

const s3=new S3({
    region:awsBucketRegion,
    accessKeyId:awsAccessKey,
    secretAccessKey:awsSecretAccessKey
})

// function to upload Image to s3

exports.uploadImageToS3=(file)=>{
    const fileStream=fs.createReadStream(file.path);
    const uploadParams={
        Bucket:awsBucketName,
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(uploadParams).promise();
}

