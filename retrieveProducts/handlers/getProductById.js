import {products} from '../data';

const getIdFromRequest = (event) => {
  try {
    const {id} = event.pathParameters;
    return id;
  } catch(error) {
    throw new Error(JSON.stringify(buildResponse(400, 'Failed to retrieve id from request')));
  }
}

const buildResponse = (status, body) => ({status, body: JSON.stringify(body)});

export const hello = async (event) => {
  try {
    const id = getIdFromRequest(event);
    if(!products) {
      throw new Error(JSON.stringify(buildResponse(404, `Failed to retrieve product with id ${id}`)));
    }

    const result = products.filter(product => product.id === id);
    if(!result) {
      throw new Error(JSON.stringify(buildResponse(404, `Failed to retrieve product with id ${id}`)));
    }

    return {
      status: 200,
      body: JSON.stringify(result);
    }
  }catch(error) {
    return JSON.parse(error.message);
  }
};
