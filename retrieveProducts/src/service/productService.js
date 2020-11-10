import { getAllProducts, getProductById, createProduct } from '../repository/productsRepository';
import { createStore } from '../repository/storeRepository';
import {withTransaction} from '../repository/transactional';

export const loadProducts = async () => {
  try {
    const products = await getAllProducts();
    products.forEach((product) => {
      if (!product.count) {
        product.count = 0;
      }
    });
    return products;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const loadProductById = async (id) => {
  try {
    const product = await getProductById(id);
    if (!product.count) {
      product.count = 0;
    }
    return product;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const postProduct = async (body) => {
  validateProduct(body);
  try {
    const product = {
      title: body.title,
      description: body.description,
      price: body.price,
      img: body.img,
      count: body.count || 0,
    };

    let newProduct = null;
    await withTransaction(async (client) => {
      newProduct = await createProduct(product, client);
      newProduct.count = product.count;
      await createStore(newProduct.id, newProduct.count, client);
    });
    return newProduct;
  } catch (err) {
    throw new Error(err.message);
  }
};

const validateProduct = (product) => {
  if(!product) {
    const error = new Error('Invalid product json was provided');
    error.type = 'bad-request';
    throw error;
  }
  if(!product.title) {
    const error = new Error('Invalid title was provided');
    error.type = 'bad-request';
    throw error;
  }
  if(!product.description) {
    const error = new Error('Invalid description was provided');
    error.type = 'bad-request';
    throw error;
  }
  if(!product.price || product.price < 0) {
    const error = new Error('Invalid price was provided');
    error.status = 'bad-request';
    throw error;
  }
  if(!product.img) {
    const error = new Error('Invalid img was provided');
    error.type = 'bad-request';
    throw error;
  }
  if(product.count && isNaN(+product.count)) {
    const error = new Error('Invalid count value was provided. Please use numeric values');
    error.type = 'bad-request';
    throw error;
  }
};
