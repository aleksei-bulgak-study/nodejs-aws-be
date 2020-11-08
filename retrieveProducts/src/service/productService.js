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
  try {
    return await createProduct({
      title: body.title,
      description: body.description,
      price: body.price,
      img: body.img,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
