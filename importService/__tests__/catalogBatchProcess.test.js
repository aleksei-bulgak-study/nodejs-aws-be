import { postProduct } from '../src/service/rds';
import snsService from '../src/service/sns';
import handler from '../src/catalogBatchProcess';

jest.mock('../src/service/sns');
jest.mock('../src/service/rds');

describe('Catalog batc process', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('success case when count less then 2', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ test: 'test message', count: 1 }),
        },
      ],
    };

    const id = 'testID';
    postProduct.mockImplementationOnce(() => Promise.resolve(id));
    snsService.mockImplementationOnce((body, owner) => Promise.resolve());

    await handler(event);

    expect(postProduct.mock.calls[0][0]).toEqual({ test: 'test message', count: 1 });
    expect(snsService.mock.calls[0][0]).toEqual(event.Records[0].body);
    expect(snsService.mock.calls[0][1]).toEqual('developer');
  });

  test('success case when count more then 2', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ test: 'test message', count: 4 }),
        },
      ],
    };

    const id = 'testID';
    postProduct.mockImplementationOnce(() => Promise.resolve(id));

    await handler(event);

    expect(postProduct.mock.calls[0][0]).toEqual({ test: 'test message', count: 4 });
    expect(snsService.mock.calls[0][0]).toEqual(event.Records[0].body);
    expect(snsService.mock.calls[0][1]).toEqual('manager');
  });

  test('when rds throws exception then sns is not called', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({ test: 'test message', count: 4 }),
        },
      ],
    };

    postProduct.mockImplementationOnce(() => Promise.reject(new Error('some test error')));

    try {
      await handler(event);
    } catch (err) {
      expect(err.message).toEqual('some test error');
    } finally {
      expect(postProduct.mock.calls[0][0]).toEqual({ test: 'test message', count: 4 });
      expect(snsService).toHaveBeenCalledTimes(0);
    }
  });
});
