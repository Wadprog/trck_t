const { Client } = require('pg');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();

async function getDbCredentials() {
  try {
    const result = await secretsManager.getSecretValue({
      SecretId: 'finance-tracker-db-secret'
    }).promise();
    
    return JSON.parse(result.SecretString);
  } catch (error) {
    console.error('Error getting database credentials:', error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    console.log('Getting database credentials...');
    const credentials = await getDbCredentials();
    
    console.log('Connecting to database...');
    const client = new Client({
      host: credentials.host,
      port: credentials.port,
      database: credentials.dbname,
      user: credentials.username,
      password: credentials.password,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('Connected to database successfully!');

    // Create categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
        color VARCHAR(20) NOT NULL,
        short_name VARCHAR(10) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log('Creating categories table...');
    await client.query(createCategoriesTable);
    console.log('Categories table created successfully!');

    // Insert some sample categories
    const insertSampleCategories = `
      INSERT INTO categories (name, icon, type, color, short_name) VALUES
      ('Food & Dining', '🍽️', 'EXPENSE', '#FF6B6B', 'FOOD'),
      ('Transportation', '🚗', 'EXPENSE', '#4ECDC4', 'TRANS'),
      ('Shopping', '🛍️', 'EXPENSE', '#45B7D1', 'SHOP'),
      ('Salary', '💰', 'INCOME', '#96CEB4', 'SAL'),
      ('Investment', '📈', 'INCOME', '#FFEAA7', 'INV')
      ON CONFLICT (name) DO NOTHING;
    `;

    console.log('Inserting sample categories...');
    await client.query(insertSampleCategories);
    console.log('Sample categories inserted successfully!');

    // Verify the data
    const result = await client.query('SELECT * FROM categories ORDER BY created_at');
    console.log('Categories in database:', result.rows);

    await client.end();
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initializeDatabase().catch(console.error);
