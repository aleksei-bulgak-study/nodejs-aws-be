import { postProduct } from '../service';
import { buildResponse } from '../utils';

const handler = async ({ body }) => {
  try {
    console.log(`Incoming request ${body}`);
    const product = await postProduct(JSON.parse(body));

    if (!product) {
      return buildResponse(500, { message: `Failed to create product` });
    }

    return buildResponse(201, product);
  } catch (error) {
    const errorCode = error.type === 'bad-request' ? 400 : 500;
    return buildResponse(errorCode, { message: error.message });
  }
};

export default handler;
