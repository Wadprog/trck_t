const { Client } = require('pg');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

let dbCredentials = null;
let dbClient = null;

const getDbCredentials = async () => {
  if (dbCredentials) return dbCredentials;
  
  const secretsManager = new SecretsManagerClient({
    region: process.env.AWS_REGION || 'us-east-1'
  });
  
  try {
    const result = await secretsManager.send(
      new GetSecretValueCommand({
        SecretId: process.env.DB_SECRET_ARN
      })
    );
    
    dbCredentials = JSON.parse(result.SecretString);
    return dbCredentials;
  } catch (error) {
    console.error('Error getting database credentials:', error);
    throw new Error('Failed to retrieve database credentials');
  }
};

const getDbClient = async () => {
  if (dbClient) return dbClient;
  
  const credentials = await getDbCredentials();
  
  dbClient = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: credentials.username,
    password: credentials.password,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  await dbClient.connect();
  return dbClient;
};

exports.getCategories = async (event) => {
  try {
    const client = await getDbClient();
    
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.icon,
        c.color,
        c.parent_id,
        c.created_at,
        c.updated_at,
        COUNT(t.id) as transaction_count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
      GROUP BY c.id, c.name, c.description, c.icon, c.color, c.parent_id, c.created_at, c.updated_at
      ORDER BY c.name ASC
    `;
    
    const result = await client.query(query);
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      transactionCount: parseInt(row.transaction_count)
    }));
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
};

exports.getCategory = async (event) => {
  try {
    const { arguments: { id } } = event;
    const client = await getDbClient();
    
    const query = `
      SELECT 
        id, name, description, icon, color, parent_id, created_at, updated_at
      FROM categories 
      WHERE id = $1
    `;
    
    const result = await client.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
};

exports.createCategory = async (event) => {
  try {
    const { arguments: { input } } = event;
    const client = await getDbClient();
    const now = new Date().toISOString();
    
    const query = `
      INSERT INTO categories (
        id, name, description, icon, color, parent_id, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7
      )
      RETURNING id, name, description, icon, color, parent_id, created_at, updated_at
    `;
    
    const values = [
      input.name,
      input.description || null,
      input.icon,
      input.color,
      input.parentId || null,
      now,
      now
    ];
    
    const result = await client.query(query, values);
    const row = result.rows[0];
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error creating category:', error);
    throw new Error('Failed to create category');
  }
};

exports.updateCategory = async (event) => {
  try {
    const { arguments: { id, input } } = event;
    const client = await getDbClient();
    const now = new Date().toISOString();
    
    const setParts = [];
    const values = [id];
    let paramIndex = 2;
    
    if (input.name !== undefined) {
      setParts.push(`name = $${paramIndex}`);
      values.push(input.name);
      paramIndex++;
    }
    if (input.description !== undefined) {
      setParts.push(`description = $${paramIndex}`);
      values.push(input.description);
      paramIndex++;
    }
    if (input.icon !== undefined) {
      setParts.push(`icon = $${paramIndex}`);
      values.push(input.icon);
      paramIndex++;
    }
    if (input.color !== undefined) {
      setParts.push(`color = $${paramIndex}`);
      values.push(input.color);
      paramIndex++;
    }
    if (input.parentId !== undefined) {
      setParts.push(`parent_id = $${paramIndex}`);
      values.push(input.parentId);
      paramIndex++;
    }
    
    setParts.push(`updated_at = $${paramIndex}`);
    values.push(now);
    
    const query = `
      UPDATE categories 
      SET ${setParts.join(', ')}
      WHERE id = $1
      RETURNING id, name, description, icon, color, parent_id, created_at, updated_at
    `;
    
    const result = await client.query(query, values);
    const row = result.rows[0];
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      parentId: row.parent_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

exports.deleteCategory = async (event) => {
  try {
    const { arguments: { id } } = event;
    const client = await getDbClient();
    
    // Check if category has transactions
    const checkQuery = `SELECT COUNT(*) FROM transactions WHERE category_id = $1`;
    const checkResult = await client.query(checkQuery, [id]);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      throw new Error('Cannot delete category with associated transactions');
    }
    
    const query = `DELETE FROM categories WHERE id = $1`;
    await client.query(query, [id]);
    
    return true;
    
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category');
  }
};
