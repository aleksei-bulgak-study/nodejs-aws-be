import AWS from 'aws-sdk';

const region = process.env.REGION;

AWS.config.update({ region });
const s3 = new AWS.S3();

export const copyFileToAnotherFolder = (filePrefix, copyToPrefix) => (bucket, fileName) => {
  const destination = fileName.replace(filePrefix, copyToPrefix);
  const params = {
    Bucket: bucket,
    CopySource: `${bucket}/${fileName}`,
    Key: destination,
  };
  console.log('Starting file copy with params', params);
  return s3.copyObject(params).promise();
};

export const deleteObject = async (bucket, key) => {
  var params = {
    Bucket: bucket,
    Key: key,
  };

  console.log('Starting file deletion with params', params);
  return s3.deleteObject(params).promise();
};
