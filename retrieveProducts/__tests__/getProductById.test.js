import getProductById from '../handlers/getProductById';
import { products } from '../data';
jest.mock('../data');

describe('getProductById', () => {
  afterEach(() => jest.resetAllMocks());
  test('when valid id specified then return product', async () => {
    products.push({ id: 234, value: 'data' });
    const response = await getProductById({ pathParameters: { id: '234' } });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(JSON.stringify({ id: 234, value: 'data' }));
  });

  test('when invalid id specified then 404 error returned', async () => {
    products.push({ id: 234, value: 'data' });
    const response = await getProductById({ pathParameters: { id: '999' } });
    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Failed to retrieve product with id 999' })
    );
  });

  test('when id was not specified then 404 error returned', async () => {
    products.push({ id: 234, value: 'data' });
    const response = await getProductById({ pathParameters: { } });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Failed to retrieve id from request' })
    );
  });

  test('when id was not numeric then 400 error returned', async () => {
    products.push({ id: 234, value: 'data' });
    const response = await getProductById({ pathParameters: { id: 'test' } });
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual(
      JSON.stringify({ message: 'Failed to retrieve id from request' })
    );
  });
});
