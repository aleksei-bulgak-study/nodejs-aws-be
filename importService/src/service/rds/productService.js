import { createProduct, createStore, withTransaction } from '../../repository';

export const postProduct = async (body) => {
  try {
    validateProduct(body);
    const product = {
      title: body.title,
      description: body.description,
      price: body.price,
      img: body.img,
      count: body.count || 0,
    };

    return await withTransaction(async (client) => {
      const {id} = await createProduct(product, client);
      await createStore(id, product.count, client);
      return id;
    });
  } catch (err) {
    console.log(`Failed to create product '${body}' due to error '${err.message}'`);
    throw err;
  }
};

const validateProduct = (product) => {
  if(!product) {
    throw new Error('Invalid product json was provided');
  }
  if(!product.title) {
    throw new Error('Invalid title was provided');
  }
  if(!product.description) {
    throw new Error('Invalid description was provided');
  }
  if(!product.price || product.price < 0) {
    throw new Error('Invalid price was provided');
  }
  if(!product.img) {
    throw new Error('Invalid img was provided');
  }
  if(product.count && isNaN(+product.count)) {
    throw new Error('Invalid count value was provided. Please use numeric values');
  }
};
