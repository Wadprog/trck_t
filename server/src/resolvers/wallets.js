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

exports.getWallets = async (event) => {
  try {
    const client = await getDbClient();
    
    const query = `
      SELECT 
        w.id,
        w.name,
        w.description,
        w.icon,
        w.color,
        w.is_default,
        w.balance,
        w.created_at,
        w.updated_at,
        COUNT(s.id) as source_count
      FROM wallets w
      LEFT JOIN sources s ON w.id = s.wallet_id AND s.is_active = true
      GROUP BY w.id, w.name, w.description, w.icon, w.color, w.is_default, w.balance, w.created_at, w.updated_at
      ORDER BY w.is_default DESC, w.name ASC
    `;
    
    const result = await client.query(query);
    
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      icon: row.icon,
      color: row.color,
      isDefault: row.is_default,
      balance: parseFloat(row.balance),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sourceCount: parseInt(row.source_count)
    }));
    
  } catch (error) {
    console.error('Error fetching wallets:', error);
    throw new Error('Failed to fetch wallets');
  }
};

exports.getWallet = async (event) => {
  try {
    const { arguments: { id } } = event;
    
    const sql = `
      SELECT 
        id, name, description, icon, color, is_default, balance, created_at, updated_at
      FROM wallets 
      WHERE id = :id
    `;
    
    const result = await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters: [
        { name: 'id', value: { stringValue: id } }
      ]
    });
    
    if (result.records.length === 0) {
      return null;
    }
    
    const record = result.records[0];
    return {
      id: record[0].stringValue,
      name: record[1].stringValue,
      description: record[2]?.stringValue,
      icon: record[3].stringValue,
      color: record[4].stringValue,
      isDefault: record[5].booleanValue,
      balance: parseFloat(record[6].stringValue),
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue
    };
    
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw new Error('Failed to fetch wallet');
  }
};

exports.createWallet = async (event) => {
  try {
    const { arguments: { input } } = event;
    const now = new Date().toISOString();
    
    const sql = `
      INSERT INTO wallets (
        id, name, description, icon, color, is_default, balance, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), :name, :description, :icon, :color, :isDefault, :balance, :createdAt, :updatedAt
      )
      RETURNING id, name, description, icon, color, is_default, balance, created_at, updated_at
    `;
    
    const result = await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters: [
        { name: 'name', value: { stringValue: input.name } },
        { name: 'description', value: { stringValue: input.description || null } },
        { name: 'icon', value: { stringValue: input.icon } },
        { name: 'color', value: { stringValue: input.color } },
        { name: 'isDefault', value: { booleanValue: input.isDefault || false } },
        { name: 'balance', value: { doubleValue: input.balance || 0 } },
        { name: 'createdAt', value: { stringValue: now } },
        { name: 'updatedAt', value: { stringValue: now } }
      ]
    });
    
    const record = result.records[0];
    return {
      id: record[0].stringValue,
      name: record[1].stringValue,
      description: record[2]?.stringValue,
      icon: record[3].stringValue,
      color: record[4].stringValue,
      isDefault: record[5].booleanValue,
      balance: parseFloat(record[6].stringValue),
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue
    };
    
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
};

exports.updateWallet = async (event) => {
  try {
    const { arguments: { id, input } } = event;
    const now = new Date().toISOString();
    
    const setParts = [];
    const parameters = [
      { name: 'id', value: { stringValue: id } },
      { name: 'updatedAt', value: { stringValue: now } }
    ];
    
    if (input.name !== undefined) {
      setParts.push('name = :name');
      parameters.push({ name: 'name', value: { stringValue: input.name } });
    }
    if (input.description !== undefined) {
      setParts.push('description = :description');
      parameters.push({ name: 'description', value: { stringValue: input.description } });
    }
    if (input.icon !== undefined) {
      setParts.push('icon = :icon');
      parameters.push({ name: 'icon', value: { stringValue: input.icon } });
    }
    if (input.color !== undefined) {
      setParts.push('color = :color');
      parameters.push({ name: 'color', value: { stringValue: input.color } });
    }
    if (input.isDefault !== undefined) {
      setParts.push('is_default = :isDefault');
      parameters.push({ name: 'isDefault', value: { booleanValue: input.isDefault } });
    }
    if (input.balance !== undefined) {
      setParts.push('balance = :balance');
      parameters.push({ name: 'balance', value: { doubleValue: input.balance } });
    }
    
    const sql = `
      UPDATE wallets 
      SET ${setParts.join(', ')}, updated_at = :updatedAt
      WHERE id = :id
      RETURNING id, name, description, icon, color, is_default, balance, created_at, updated_at
    `;
    
    const result = await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters
    });
    
    const record = result.records[0];
    return {
      id: record[0].stringValue,
      name: record[1].stringValue,
      description: record[2]?.stringValue,
      icon: record[3].stringValue,
      color: record[4].stringValue,
      isDefault: record[5].booleanValue,
      balance: parseFloat(record[6].stringValue),
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue
    };
    
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw new Error('Failed to update wallet');
  }
};

exports.deleteWallet = async (event) => {
  try {
    const { arguments: { id } } = event;
    
    // Check if wallet has sources
    const checkSQL = `SELECT COUNT(*) FROM sources WHERE wallet_id = :id`;
    const checkResult = await rdsData.executeStatement({
      ...dbParams,
      sql: checkSQL,
      parameters: [
        { name: 'id', value: { stringValue: id } }
      ]
    });
    
    if (parseInt(checkResult.records[0][0].longValue) > 0) {
      throw new Error('Cannot delete wallet with associated sources');
    }
    
    const sql = `DELETE FROM wallets WHERE id = :id`;
    
    await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters: [
        { name: 'id', value: { stringValue: id } }
      ]
    });
    
    return true;
    
  } catch (error) {
    console.error('Error deleting wallet:', error);
    throw new Error('Failed to delete wallet');
  }
};
