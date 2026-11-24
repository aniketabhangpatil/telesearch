import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const isCloudSSL = 
  process.env.DB_SSL === 'true' || 
  (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com')) || 
  process.env.DB_PORT === '4000' ||
  parseInt(process.env.DB_PORT, 10) === 4000;

const sslOptions = isCloudSSL
  ? {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
      }
    }
  : {};

let pool;

if (process.env.DATABASE_URL) {
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ...sslOptions,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8mb4'
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'telegram_channel_finder',
    ...sslOptions,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    charset: 'utf8mb4'
  });
}

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      '✅ Connected successfully to MySQL database:',
      process.env.DB_NAME || 'telegram_channel_finder'
    );
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error.message);
    return false;
  }
};

export default pool;
