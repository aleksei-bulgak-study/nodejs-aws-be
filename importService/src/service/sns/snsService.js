import AWS from 'aws-sdk';

const region = process.env.REGION;
const snsTopicUrl = process.env.SNS_TOPIC;

AWS.config.update({ region });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

export default async (data, owner = 'developer') => {
  const params = {
    MessageAttributes: {
      owner: {
        DataType: 'String',
        StringValue: owner
      }
    },
    Message: JSON.stringify(data),
    TopicArn: snsTopicUrl,
  };

  return sns.publish(params).promise();
};
