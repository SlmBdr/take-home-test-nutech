import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Use DATABASE_URL if available, otherwise fallback to local configurations
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[], name?: string) {
  const start = Date.now();
  const queryConfig = name ? { name, text, values: params } : { text, values: params };
  const res = await pool.query(queryConfig);
  const duration = Date.now() - start;
  // Silent log in dev / prod to keep output clean, but useful for debugging
  return res;
}

export async function getClient() {
  return await pool.connect();
}

export async function initDb() {
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        balance BIGINT DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id SERIAL PRIMARY KEY,
        banner_name VARCHAR(100) NOT NULL,
        banner_image VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        service_code VARCHAR(50) PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        service_icon VARCHAR(255) NOT NULL,
        service_tariff BIGINT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        invoice_number VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        transaction_type VARCHAR(10) NOT NULL,
        service_code VARCHAR(50) REFERENCES services(service_code) ON DELETE SET NULL,
        description VARCHAR(255) NOT NULL,
        total_amount BIGINT NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Database tables verified/created successfully.');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize database tables:', error);
    throw error;
  } finally {
    client.release();
  }
}
