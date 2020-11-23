import AwsSdkMock from 'aws-sdk-mock';

const wrapper = async (data, owner) => {
  const snsService = await (await import('../../../src/service/sns')).default;
  return await snsService(data, owner);
};

describe('sns', () => {
  const snsProcessing = jest.fn().mockImplementationOnce((params, callback) => {
    callback(null, 'success');
  });
  beforeEach(() => {
    AwsSdkMock.mock('SNS', 'publish', snsProcessing);
    AwsSdkMock.mock('config', 'update', () => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
    AwsSdkMock.restore('SNS', 'publish');
  });

  test('success case when developer attribut is set', async () => {
    const dataToPost = { test: 'some test message' };
    const owner = 'developer';

    expect(await wrapper(dataToPost, owner)).toEqual('success');
    expect(snsProcessing.mock.calls[0][0]).toEqual({
      Message: JSON.stringify(dataToPost),
      MessageAttributes: { owner: { DataType: 'String', StringValue: owner } },
      TopicArn: 'test',
    });
  });

  test('when no data specified then expect exception', async () => {
    const dataToPost = undefined;
    const owner = 'developer';

    try {
        await wrapper(dataToPost, owner);
        expect(false).toEqual(true);
    } catch(err) {
        expect(err.message).toEqual("Missing required key 'Message' in params");
    }
  });
});
