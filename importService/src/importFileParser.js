import AWS from 'aws-sdk';
import csv from 'csv-parser';

const s3 = new AWS.S3();
AWS.config.update({ region: 'eu-west-1' });

const filePrefix = process.env.IMPORT_FILE_PREFIX;
const copyPrefix = process.env.COPY_PREFIX;

const copyFileToProcessedFolder = (bucket, fileName) => {
  const destination = fileName.replace(filePrefix, copyPrefix);
  const params = {
    Bucket: bucket,
    CopySource: `${bucket}/${fileName}`,
    Key: destination,
  };
  console.log('Starting file copy with params', params);
  return new Promise((resolve, reject) => {
    s3.copyObject(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const deleteObject = async (bucket, key) => {
  var params = {
    Bucket: bucket,
    Key: key,
  };

  console.log('Starting file deletion with params', params);
  return new Promise((resolve, reject) => {
    s3.deleteObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const handler = async (event) => {
  for (const record of event.Records) {
    console.log(record.s3.bucket.name, record.s3.object.key);
    const bucket = record.s3.bucket.name;
    const fileName = record.s3.object.key;
    await new Promise((resolve, reject) => {
      const stream = s3.getObject({ Bucket: bucket, Key: fileName }).createReadStream();
      stream
        .pipe(csv())
        .on('data', (data) => console.log('New record', data))
        .on('end', () => resolve('succesfully processed all file'))
        .on('error', () => reject(new Error('failed to read file')));
    })
      .then(() => copyFileToProcessedFolder(bucket, fileName))
      .then(() => deleteObject(bucket, fileName))
      .catch((e) => console.log('Failed to process file due to error', e));
  }
};

export default handler;
