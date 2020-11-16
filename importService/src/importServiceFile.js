import AWS from 'aws-sdk';

const s3 = new AWS.S3();
AWS.config.update({ region: 'eu-west-1' });

const importBucketName = process.env.IMPORT_BUCKET_NAME;
const defaultExpiration = process.env.SIGNED_URL_EXPIRATION;
const filePrefix = process.env.IMPORT_FILE_PREFIX;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const buildResponse = (statusCode, body, headers = CORS_HEADERS) => ({
  statusCode,
  body: JSON.stringify(body),
  headers,
});

const handler = async (event) => {
  console.log('Incoming reqeust', event);
  const {
    queryStringParameters: { name },
  } = event;
  if (!name) {
    return buildResponse(400, { message: 'Invalid filename was specified' });
  }

  try {
    const params = {
      Bucket: importBucketName,
      Key: `${filePrefix}${name}`,
      Expires: +defaultExpiration,
      ContentType: 'text/csv'
    };
    const url = await s3.getSignedUrlPromise('putObject', params);
    return buildResponse(201, { url });
  } catch (err) {
    return buildResponse(500, { message: `Failed to build url due to ${err}` });
  }
};

export default handler;
