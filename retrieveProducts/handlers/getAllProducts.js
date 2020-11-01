import { products } from '../data';

const handler = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Failed to retrive products due to ${JSON.stringify(error)}`,
      }),
    };
  }
};

export default handler;
