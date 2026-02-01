const { Client } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

exports.handler = async (event) => {
  try {
    console.log('Getting database credentials...');
    
    const secretsManager = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    
    // Get credentials from Secrets Manager
    const secretResult = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: process.env.DB_SECRET_ARN
      })
    );
    
    const credentials = JSON.parse(secretResult.SecretString);
    
    // Add database connection details
    const dbConfig = {
      host: process.env.DATABASE_ENDPOINT,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      user: credentials.username,
      password: credentials.password,
      ssl: {
        rejectUnauthorized: false
      }
    };

    console.log('Connecting to database at:', dbConfig.host);
    const client = new Client(dbConfig);
    await client.connect();
    console.log('Connected to database successfully!');

    // Create categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
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
    console.log('Categories in database:', result.rows.length, 'rows');

    await client.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Database initialized successfully',
        categoriesCount: result.rows.length,
        categories: result.rows
      })
    };
  } catch (error) {
    console.error('Error initializing database:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      })
    };
  }
};
