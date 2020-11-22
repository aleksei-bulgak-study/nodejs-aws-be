import AWS from 'aws-sdk';

const region = process.env.REGION;
const sqsTopicUrl = process.env.SQS_TOPIC;

AWS.config.update({ region });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const postRecordToSqs = async (record) => {
  const { QueueUrl } = await sqs.getQueueUrl({ QueueName: sqsTopicUrl }).promise();
  const params = {
    MessageBody: JSON.stringify(record),
    QueueUrl: QueueUrl,
    DelaySeconds: 0,
  };
  return sqs.sendMessage(params).promise();
};

export const postDataToSqs = async (records) => {
  for (const record of records) {
    await postRecordToSqs(record);
  }
};
