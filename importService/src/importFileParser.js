import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { Transform } from 'stream';
import { postDataToSqs } from './service/sqs';
import { copyFileToAnotherFolder, deleteObject } from './service/s3';

const region = process.env.REGION;
const filePrefix = process.env.IMPORT_FILE_PREFIX;
const copyPrefix = process.env.COPY_PREFIX;

AWS.config.update({ region });
const s3 = new AWS.S3();

const copyFileToProcessedFolder = copyFileToAnotherFolder(filePrefix, copyPrefix);

// class SendRecordToSqsTransformer extends Transform {
//   _transform(chunk, _, callback) {
//     console.log('Chunk for processing', chunk);
//     postDataToSqs(chunk)
//       .then((data) => callback(null, data))
//       .catch((err) => callback(err));
//   }
// }

const handler = async (event) => {
  for (const record of event.Records) {
    console.log(record.s3.bucket.name, record.s3.object.key);
    const bucket = record.s3.bucket.name;
    const fileName = record.s3.object.key;
    await new Promise((resolve, reject) => {
      const stream = s3.getObject({ Bucket: bucket, Key: fileName }).createReadStream();
      // const sendRecordToSqs = new SendRecordToSqsTransformer();
      console.log(`create stream for file ${bucket} ${fileName}`);
      const records = [];
      stream
        .pipe(csv())
        .on('data', (data) => {
          console.log('New record', data);
          records.push(data);
        })
        .on('end', () => resolve(records))
        .on('error', () => reject(new Error('failed to read file')));
    })
      .then((data) => postDataToSqs(data))
      .then(() => copyFileToProcessedFolder(bucket, fileName))
      .then(() => deleteObject(bucket, fileName))
      .catch((e) => console.log('Failed to process file due to error', e));
  }
};

export default handler;
