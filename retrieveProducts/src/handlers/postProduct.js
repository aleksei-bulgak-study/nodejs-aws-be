import { postProduct } from '../service';
import { buildResponse } from '../utils';

const handler = async ({ body }) => {
  try {
    const product = await postProduct(JSON.parse(body));

    if (!product) {
      return buildResponse(500, { message: `Failed to create product` });
    }

    return buildResponse(201, product);
  } catch (error) {
    return buildResponse(500, { message: error.message });
  }
};

export default handler;
