import importServiceFile from '../src/importServiceFile';

jest.mock('aws-sdk', () => ({
  config: {
    update: jest.fn(),
  },
  S3: jest.fn().mockImplementation(() => ({
    getSignedUrlPromise: jest.fn(() => 'http://signed_url'),
  })),
}));

describe('importServiceFile', () => {
  afterEach(() => jest.resetAllMocks());
  test('success case', async () => {
    const response = await importServiceFile({
      queryStringParameters: { name: 'testfilename.txt' },
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual('{"url":"http://signed_url"}');
  });

  test('when name was not specified then expect 400 status code', async () => {
    const response = await importServiceFile({ queryStringParameters: { name: null } });
    expect(response.statusCode).toEqual(400);
  });
});
