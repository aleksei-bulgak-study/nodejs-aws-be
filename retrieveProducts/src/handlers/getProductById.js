import { loadProductById } from '../service';
import { buildResponse } from '../utils';

const getIdFromRequest = (event) => {
  try {
    const { id } = event.pathParameters;
    if (id) {
      return id;
    }
    throw new Error();
  } catch (error) {
    throw new Error(
      JSON.stringify(buildResponse(400, { message: 'Failed to retrieve id from request' }))
    );
  }
};

const handler = async (event) => {
  try {
    const id = getIdFromRequest(event);
    const product = await loadProductById(id);

    if (!product) {
      return buildResponse(404, `Failed to retrieve product with id ${id}`);
    }

    return buildResponse(200, product);
  } catch (error) {
    return buildResponse(500, { message: error.message });
  }
};

export default handler;
