const { Client } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

let dbCredentials = null;

const getDbCredentials = async () => {
  if (dbCredentials) return dbCredentials;
  
  const secretsManager = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  try {
    console.log('Getting DB credentials from secret:', process.env.DB_SECRET_ARN);
    const result = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: process.env.DB_SECRET_ARN
      })
    );
    
    dbCredentials = JSON.parse(result.SecretString);
    console.log('Credentials retrieved successfully');
    return dbCredentials;
  } catch (error) {
    console.error('Error getting database credentials:', error);
    throw new Error('Failed to retrieve database credentials');
  }
};

const connectToDatabase = async () => {
  try {
    console.log('Connecting to database...');
    
    // Temporarily hardcode credentials for testing
    const credentials = {
      username: 'financeadmin',
      password: 'TempPassword123!'
    };
    
    const client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: credentials.username,
      password: credentials.password,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000
    });
    
    console.log('Attempting database connection...');
    await client.connect();
    console.log('Database connected successfully');
    
    // Create table if it doesn't exist
    const createTableQuery = `
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
    
    console.log('Creating categories table if not exists...');
    await client.query(createTableQuery);
    console.log('Table creation completed');
    
    // Insert sample data if table is empty
    const countResult = await client.query('SELECT COUNT(*) FROM categories');
    const count = parseInt(countResult.rows[0].count);
    console.log('Current categories count:', count);
    
    if (count === 0) {
      console.log('Inserting sample categories...');
      const insertSampleData = `
        INSERT INTO categories (name, icon, type, color, short_name) VALUES
        ('Food & Dining', '🍽️', 'EXPENSE', '#FF6B6B', 'FOOD'),
        ('Transportation', '🚗', 'EXPENSE', '#4ECDC4', 'TRANS'),
        ('Shopping', '🛍️', 'EXPENSE', '#45B7D1', 'SHOP'),
        ('Salary', '💰', 'INCOME', '#96CEB4', 'SAL'),
        ('Investment', '📈', 'INCOME', '#FFEAA7', 'INV');
      `;
      await client.query(insertSampleData);
      console.log('Sample categories inserted');
    }
    
    return client;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

exports.getCategories = async (event) => {
  console.log('getCategories function started');
  console.log('Environment variables:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_SECRET_ARN exists:', !!process.env.DB_SECRET_ARN);
  
  let client = null;
  
  try {
    console.log('Attempting database connection...');
    client = await connectToDatabase();
    
    console.log('Querying categories...');
    const query = `
      SELECT 
        id, 
        name, 
        icon, 
        type, 
        color, 
        short_name,
        created_at,
        updated_at
      FROM categories 
      ORDER BY name ASC
    `;
    
    const result = await client.query(query);
    console.log('Query completed, found', result.rows.length, 'categories');
    
    const categories = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      icon: row.icon,
      type: row.type,
      color: row.color,
      shortName: row.short_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    return categories;
    
  } catch (error) {
    console.error('Error in getCategories:', error);
    console.error('Error stack:', error.stack);
    
    // Return static data as fallback
    console.log('Returning fallback static data');
    return [
      {
        id: '1',
        name: 'Food & Dining',
        icon: '🍽️',
        type: 'EXPENSE',
        color: '#FF6B6B',
        shortName: 'FOOD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Salary',
        icon: '💰',
        type: 'INCOME',
        color: '#96CEB4',
        shortName: 'SAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  } finally {
    if (client) {
      try {
        await client.end();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};

exports.getCategory = async (event) => {
  console.log('getCategory function started');
  const { arguments: { id } } = event;
  console.log('Requested category ID:', id);
  
  let client = null;
  
  try {
    client = await connectToDatabase();
    
    const query = `
      SELECT 
        id, name, icon, type, color, short_name, created_at, updated_at
      FROM categories 
      WHERE id = $1
    `;
    
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      console.log('Category not found');
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      type: row.type,
      color: row.color,
      shortName: row.short_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error in getCategory:', error);
    throw new Error('Failed to fetch category');
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};

exports.createCategory = async (event) => {
  console.log('createCategory function started');
  const { arguments: { input } } = event;
  console.log('Create category input:', input);
  
  let client = null;
  
  try {
    client = await connectToDatabase();
    
    const query = `
      INSERT INTO categories (name, icon, type, color, short_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, icon, type, color, short_name, created_at, updated_at
    `;
    
    const result = await client.query(query, [
      input.name,
      input.icon,
      input.type,
      input.color,
      input.shortName
    ]);
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      type: row.type,
      color: row.color,
      shortName: row.short_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw new Error('Failed to create category');
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};

exports.updateCategory = async (event) => {
  console.log('updateCategory function started');
  const { arguments: { id, input } } = event;
  console.log('Update category ID:', id, 'Input:', input);
  
  let client = null;
  
  try {
    client = await connectToDatabase();
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (input.name !== undefined) {
      updateFields.push(`name = $${paramIndex}`);
      values.push(input.name);
      paramIndex++;
    }
    if (input.icon !== undefined) {
      updateFields.push(`icon = $${paramIndex}`);
      values.push(input.icon);
      paramIndex++;
    }
    if (input.type !== undefined) {
      updateFields.push(`type = $${paramIndex}`);
      values.push(input.type);
      paramIndex++;
    }
    if (input.color !== undefined) {
      updateFields.push(`color = $${paramIndex}`);
      values.push(input.color);
      paramIndex++;
    }
    if (input.shortName !== undefined) {
      updateFields.push(`short_name = $${paramIndex}`);
      values.push(input.shortName);
      paramIndex++;
    }
    
    updateFields.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE categories 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, icon, type, color, short_name, created_at, updated_at
    `;
    
    const result = await client.query(query, values);
    
    if (result.rows.length === 0) {
      console.log('Category not found for update');
      throw new Error('Category not found');
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      icon: row.icon,
      type: row.type,
      color: row.color,
      shortName: row.short_name,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw new Error('Failed to update category');
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};

exports.deleteCategory = async (event) => {
  console.log('deleteCategory function started');
  const { arguments: { id } } = event;
  console.log('Delete category ID:', id);
  
  let client = null;
  
  try {
    client = await connectToDatabase();
    
    const query = 'DELETE FROM categories WHERE id = $1';
    const result = await client.query(query, [id]);
    
    return result.rowCount > 0;
    
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw new Error('Failed to delete category');
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error('Error closing database connection:', error);
      }
    }
  }
};
