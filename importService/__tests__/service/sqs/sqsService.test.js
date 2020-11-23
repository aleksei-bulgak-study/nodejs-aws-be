import AwsSdkMock from 'aws-sdk-mock';

const wrapper = async (data) => {
  process.env.REGION = 'test';
  process.env.SQS_TOPIC = 'test';
  const { postDataToSqs } = await import('../../../src/service/sqs');
  return await postDataToSqs(data);
};

describe('sqs', () => {
  const testQueueUrl = 'arn:testQueueUrl';
  const sqsProcessing = jest.fn().mockImplementationOnce((params, callback) => {
    callback(null, 'success');
  });
  beforeEach(() => {
    AwsSdkMock.mock('SQS', 'sendMessage', sqsProcessing);
    AwsSdkMock.mock('SQS', 'getQueueUrl', (_, callback) =>
      callback(null, { QueueUrl: testQueueUrl })
    );
    AwsSdkMock.mock('config', 'update', () => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    AwsSdkMock.restore('SQS', 'sendMessage');
  });

  test('success case when developer attribut is set', async () => {
    const dataToPost = { test: 'some test message' };

    await wrapper([dataToPost]);
    expect(sqsProcessing.mock.calls[0][0]).toEqual({
      DelaySeconds: 0,
      MessageBody: JSON.stringify(dataToPost),
      QueueUrl: testQueueUrl,
    });
  });

  test('when message was not specified then expect exception', async () => {
    const dataToPost = undefined;

    try {
      await wrapper([dataToPost]);
      expect(false).toEqual(true);
    } catch (err) {
      expect(err.message).toEqual("Missing required key 'MessageBody' in params");
    }
  });
});
