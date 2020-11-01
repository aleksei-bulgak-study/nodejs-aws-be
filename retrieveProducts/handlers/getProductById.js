import {products} from '../data';

const buildResponse = (statusCode, body) => ({statusCode, body: JSON.stringify(body)});

const getIdFromRequest = (event) => {
  try {
    const {id} = event.pathParameters;
    if(!isNaN(+id) && +id) {
      return +id;
    }
    throw new Error();
  } catch(error) {
    throw new Error(JSON.stringify(buildResponse(400, {message: 'Failed to retrieve id from request'})));
  }
}

const handler = async (event) => {
  try {
    const id = getIdFromRequest(event);
    if(!products) {
      throw new Error(JSON.stringify(buildResponse(404, {message:`Failed to retrieve product with id ${id}`})));
    }
    const result = products.filter(product => product.id === id);
    if(!result || !result.length) {
      throw new Error(JSON.stringify(buildResponse(404, {message:`Failed to retrieve product with id ${id}`})));
    }

    return buildResponse(200, result[0]);
  }catch(error) {
    return JSON.parse(error.message);
  }
};

export default handler;
