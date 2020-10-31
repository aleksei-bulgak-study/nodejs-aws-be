import {products} from '../data';

export const handler = async () => {
  try {
    return {
      status: 200,
      body: products
    }
  } catch(error) {
    return {
      status: 500,
      body: `Failed to retrive products due to ${JSON.stringify(error)}`
    }
  }
};
