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

export const withTransaction = async (operation) => {
    const client = new Client(dbOptions);
    await client.connect();
    try {
        await client.query('BEGIN');
        await operation(client);
        await client.query('COMMIT');
    } catch(err) {
        await client.query('ROLLBACK');
        throw new Error(`Operation failed due to ${err.message}`);
    } finally {
        await client.end();
    }
}