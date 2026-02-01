const fs = require('fs');
const path = require('path');

/**
 * Stitches together GraphQL schema files from the schemas directory
 * into a single schema.graphql file
 */
function stitchSchemas() {
  const schemasDir = path.join(__dirname, 'schemas');
  const outputFile = path.join(__dirname, 'schema.graphql');
  
  // Define the order of schema files to ensure proper composition
  const schemaFiles = [
    'base.graphql',      // Must be first to define root types
    'categories.graphql',
    'transactions.graphql', 
    'wallets.graphql',
    'sources.graphql'
  ];
  
  let combinedSchema = '# Generated GraphQL Schema\n';
  combinedSchema += '# This file is auto-generated. Do not edit directly.\n';
  combinedSchema += '# Edit individual schema files in the schemas/ directory instead.\n\n';
  
  for (const fileName of schemaFiles) {
    const filePath = path.join(schemasDir, fileName);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      combinedSchema += `# === ${fileName.toUpperCase().replace('.GRAPHQL', '')} SCHEMA ===\n`;
      combinedSchema += content;
      combinedSchema += '\n\n';
    } else {
      console.warn(`Warning: Schema file ${fileName} not found`);
    }
  }
  
  // Write the combined schema
  fs.writeFileSync(outputFile, combinedSchema, 'utf8');
  console.log(`✅ Schema stitched successfully! Generated: ${outputFile}`);
  
  // Log the files that were combined
  console.log('📁 Combined schemas:');
  schemaFiles.forEach(file => {
    const filePath = path.join(schemasDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`   - ${file}`);
    }
  });
}

// Run the stitching if this script is executed directly
if (require.main === module) {
  stitchSchemas();
}

module.exports = { stitchSchemas };
