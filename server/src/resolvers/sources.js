const { RDSDataService } = require('@aws-sdk/client-rds-data');

const rdsData = new RDSDataService({
  region: process.env.AWS_REGION || 'us-east-1'
});

const dbParams = {
  resourceArn: process.env.DB_CLUSTER_ARN,
  secretArn: process.env.DB_SECRET_ARN,
  database: 'financetracker'
};

exports.getSources = async (event) => {
  try {
    const sql = `
      SELECT 
        s.id,
        s.name,
        s.description,
        s.icon,
        s.color,
        s.is_active,
        s.wallet_id,
        s.created_at,
        s.updated_at,
        w.name as wallet_name,
        COUNT(t.id) as transaction_count
      FROM sources s
      LEFT JOIN wallets w ON s.wallet_id = w.id
      LEFT JOIN transactions t ON s.id = t.source_id
      GROUP BY s.id, s.name, s.description, s.icon, s.color, s.is_active, s.wallet_id, s.created_at, s.updated_at, w.name
      ORDER BY s.is_active DESC, s.name ASC
    `;
    
    const result = await rdsData.executeStatement({
      ...dbParams,
      sql
    });
    
    return result.records.map(record => ({
      id: record[0].stringValue,
      name: record[1].stringValue,
      description: record[2]?.stringValue,
      icon: record[3].stringValue,
      color: record[4].stringValue,
      isActive: record[5].booleanValue,
      walletId: record[6].stringValue,
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue,
      walletName: record[9].stringValue,
      transactionCount: parseInt(record[10].longValue)
    }));
    
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw new Error('Failed to fetch sources');
  }
};

exports.getSource = async (event) => {
  try {
    const { arguments: { id } } = event;
    
    const sql = `
      SELECT 
        s.id, s.name, s.description, s.icon, s.color, s.is_active, s.wallet_id, s.created_at, s.updated_at,
        w.name as wallet_name
      FROM sources s
      LEFT JOIN wallets w ON s.wallet_id = w.id
      WHERE s.id = :id
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
      isActive: record[5].booleanValue,
      walletId: record[6].stringValue,
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue,
      walletName: record[9]?.stringValue
    };
    
  } catch (error) {
    console.error('Error fetching source:', error);
    throw new Error('Failed to fetch source');
  }
};

exports.createSource = async (event) => {
  try {
    const { arguments: { input } } = event;
    const now = new Date().toISOString();
    
    // Verify wallet exists
    const walletCheckSQL = `SELECT id FROM wallets WHERE id = :walletId`;
    const walletResult = await rdsData.executeStatement({
      ...dbParams,
      sql: walletCheckSQL,
      parameters: [
        { name: 'walletId', value: { stringValue: input.walletId } }
      ]
    });
    
    if (walletResult.records.length === 0) {
      throw new Error('Wallet not found');
    }
    
    const sql = `
      INSERT INTO sources (
        id, name, description, icon, color, is_active, wallet_id, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), :name, :description, :icon, :color, :isActive, :walletId, :createdAt, :updatedAt
      )
      RETURNING id, name, description, icon, color, is_active, wallet_id, created_at, updated_at
    `;
    
    const result = await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters: [
        { name: 'name', value: { stringValue: input.name } },
        { name: 'description', value: { stringValue: input.description || null } },
        { name: 'icon', value: { stringValue: input.icon } },
        { name: 'color', value: { stringValue: input.color } },
        { name: 'isActive', value: { booleanValue: input.isActive !== false } },
        { name: 'walletId', value: { stringValue: input.walletId } },
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
      isActive: record[5].booleanValue,
      walletId: record[6].stringValue,
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue
    };
    
  } catch (error) {
    console.error('Error creating source:', error);
    throw new Error('Failed to create source');
  }
};

exports.updateSource = async (event) => {
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
    if (input.isActive !== undefined) {
      setParts.push('is_active = :isActive');
      parameters.push({ name: 'isActive', value: { booleanValue: input.isActive } });
    }
    if (input.walletId !== undefined) {
      // Verify new wallet exists
      const walletCheckSQL = `SELECT id FROM wallets WHERE id = :walletId`;
      const walletResult = await rdsData.executeStatement({
        ...dbParams,
        sql: walletCheckSQL,
        parameters: [
          { name: 'walletId', value: { stringValue: input.walletId } }
        ]
      });
      
      if (walletResult.records.length === 0) {
        throw new Error('Wallet not found');
      }
      
      setParts.push('wallet_id = :walletId');
      parameters.push({ name: 'walletId', value: { stringValue: input.walletId } });
    }
    
    const sql = `
      UPDATE sources 
      SET ${setParts.join(', ')}, updated_at = :updatedAt
      WHERE id = :id
      RETURNING id, name, description, icon, color, is_active, wallet_id, created_at, updated_at
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
      isActive: record[5].booleanValue,
      walletId: record[6].stringValue,
      createdAt: record[7].stringValue,
      updatedAt: record[8].stringValue
    };
    
  } catch (error) {
    console.error('Error updating source:', error);
    throw new Error('Failed to update source');
  }
};

exports.deleteSource = async (event) => {
  try {
    const { arguments: { id } } = event;
    
    // Check if source has transactions
    const checkSQL = `SELECT COUNT(*) FROM transactions WHERE source_id = :id`;
    const checkResult = await rdsData.executeStatement({
      ...dbParams,
      sql: checkSQL,
      parameters: [
        { name: 'id', value: { stringValue: id } }
      ]
    });
    
    if (parseInt(checkResult.records[0][0].longValue) > 0) {
      throw new Error('Cannot delete source with associated transactions');
    }
    
    const sql = `DELETE FROM sources WHERE id = :id`;
    
    await rdsData.executeStatement({
      ...dbParams,
      sql,
      parameters: [
        { name: 'id', value: { stringValue: id } }
      ]
    });
    
    return true;
    
  } catch (error) {
    console.error('Error deleting source:', error);
    throw new Error('Failed to delete source');
  }
};
