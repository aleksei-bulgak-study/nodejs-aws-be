import { loadProducts } from '../service';
import { buildResponse } from '../utils';

const handler = async (event) => {
  try {
    console.log(`Incoming request ${JSON.stringify(event)}`);
    const products = await loadProducts();
    return buildResponse(200, products);
  } catch (error) {
    return buildResponse(500, {
      message: `Failed to retrive products due to ${error.message}`,
    });
  }
};

export default handler;
