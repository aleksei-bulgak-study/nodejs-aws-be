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
