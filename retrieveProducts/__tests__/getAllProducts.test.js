import getAllProducts from '../handlers/getAllProducts';
import {products} from '../data';
jest.mock('../data');

describe('getAllProducts', () => {
    afterEach(() => jest.resetAllMocks());
    test('when products exist then return array of products', async () => {
        products.push({id: 'data'});
        const response = await getAllProducts();
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual(JSON.stringify([{id: 'data'}]));
    });
});