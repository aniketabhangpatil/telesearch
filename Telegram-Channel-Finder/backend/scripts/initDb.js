import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDatabaseInitialization() {
  console.log('🔄 Initializing Telegram Channel Finder MySQL Database...');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'telegram_channel_finder';

  console.log(`Connecting to MySQL host: ${dbHost}:${dbPort} as user: ${dbUser}...`);

  let rootConnection;
  try {
    // Step 1: Connect to server without database to create database if needed
    rootConnection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      multipleStatements: true
    });
    console.log('✅ Connected to MySQL server.');

    console.log(`Creating database \`${dbName}\` if not exists...`);
    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await rootConnection.end();

    // Step 2: Connect directly to the database
    const dbConnection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      multipleStatements: true
    });
    console.log(`✅ Connected to database \`${dbName}\`.`);

    // Step 3: Read and execute schema.sql
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📜 Executing schema.sql...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await dbConnection.query(schemaSql);
      console.log('✅ Schema tables successfully created/verified.');
    } else {
      console.warn('⚠️ schema.sql not found at:', schemaPath);
    }

    // Step 4: Read and execute seed.sql
    const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('🌱 Executing seed.sql...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await dbConnection.query(seedSql);
      console.log('✅ Seeds successfully executed.');
    } else {
      console.warn('⚠️ seed.sql not found at:', seedPath);
    }

    // Step 5: Initialize Admin User securely using bcrypt
    const adminUser = process.env.INITIAL_ADMIN_USERNAME || 'silkroad2.o';
    const adminPass = process.env.INITIAL_ADMIN_PASSWORD || 'silkroad3.o';

    const [existingAdmin] = await dbConnection.query(
      'SELECT id, username FROM admin_users WHERE username = ?',
      [adminUser]
    );

    if (existingAdmin.length === 0) {
      console.log(`🔐 Creating initial admin account (${adminUser})...`);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPass, saltRounds);
      await dbConnection.query(
        'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
        [adminUser, hashedPassword]
      );
      console.log(`✅ Admin user "${adminUser}" created successfully.`);
    } else {
      console.log(`ℹ️ Admin user "${adminUser}" already exists.`);
    }

    // Step 6: Verify site_settings
    const [settings] = await dbConnection.query('SELECT setting_key, setting_value FROM site_settings');
    console.log('⚙️ Current Site Settings:', settings.map(s => `${s.setting_key}=${s.setting_value}`).join(', '));

    await dbConnection.end();
    console.log('\n🎉 Database initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('\n❌ Database initialization error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Please check DB_USER and DB_PASSWORD in backend/.env file.');
    }
    return false;
  }
}

// Run directly if called as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDatabaseInitialization().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export default runDatabaseInitialization;

