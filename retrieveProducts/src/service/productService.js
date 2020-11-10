import { getAllProducts, getProductById, createProduct } from '../repository/productsRepository';
import { getStores } from '../repository/storeRepository';

export const loadProducts = async () => {
  try {
    const [products, stores] = await Promise.all([getAllProducts(), getStores()]);
    products.forEach((product) => {
      const productStore = stores.find((store) => store.product_id === product.id);
      if (productStore) {
        product.count = productStore.count;
      }
    });
    return products;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const loadProductById = async (id) => {
  try {
    const [product, stores] = await Promise.all([getProductById(id), getStores()]);
    const store = stores.find((store) => store.product_id === product.id);
    if (store) {
      product.count = store.count;
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
    };
    return await createProduct(product);
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
};
