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

export const getStores = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: stores } = await client.query('SELECT * FROM store');
    return stores;
  } catch (err) {
    throw new Error(`Failed to get stores due to error ${err.message}`);
  } finally {
    await client.end();
  }
};

export const createStore = async (id, count = 0, externalClient) => {
  let client = externalClient;
  if (!client) {
    client = new Client(dbOptions);
    await client.connect();
  }

  try {
    await client.query('INSERT INTO store(product_id, count) VALUES($1, $2)', [id, count]);
  } catch (err) {
    throw new Error(`Failed to create store record for  due to error ${err.message}`);
  } finally {
    if (!externalClient) {
      await client.end();
    }
  }
};