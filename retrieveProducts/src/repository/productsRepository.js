import { Client } from 'pg';

const { DB_URL, DB_PORT, DB_USERNAME, DB_PASSWORD } = process.env;
const dbOptions = {
  host: DB_URL,
  port: DB_PORT,
  database: 'postgres',
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const getAllProducts = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products } = await client.query(
      'SELECT p.id, p.title, p.description, p.price, p.img, s.count FROM product p LEFT JOIN store s ON p.id = s.product_id'
    );
    return products;
  } catch (err) {
    throw new Error(`Failed to get products due to error ${err.message}`);
  } finally {
    await client.end();
  }
};

export const getProductById = async (id) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const {
      rows: product,
    } = await client.query(
      'SELECT p.id, p.title, p.description, p.price, p.img, s.count FROM product p LEFT JOIN store s ON p.id = s.product_id WHERE p.id = $1',
      [id]
    );
    return product[0];
  } catch (err) {
    throw new Error(`Failed to get product by id ${id}`);
  } finally {
    await client.end();
  }
};

export const createProduct = async (product, externalClient) => {
  let client = externalClient;
  if (!client) {
    client = new Client(dbOptions);
    await client.connect();
  }

  try {
    const {
      rows: results,
    } = await client.query(
      'INSERT INTO product(title, description, price, img) VALUES($1, $2, $3, $4) RETURNING *',
      [product.title, product.description, product.price, product.img]
    );
    return results[0];
  } catch (err) {
    throw new Error(`Failed to create product ${product}`);
  } finally {
    if (!externalClient) {
      await client.end();
    }
  }
};
