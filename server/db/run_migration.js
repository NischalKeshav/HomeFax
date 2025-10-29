const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'arjunparadkar',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'homefax',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

async function runMigration() {
  try {
    console.log('Starting database migration...');

    // Read and execute add_property_details.sql
    console.log('Adding property details columns...');
    const addDetailsSQL = fs.readFileSync(path.join(__dirname, 'add_property_details.sql'), 'utf8');
    await pool.query(addDetailsSQL);
    console.log('✓ Added property details columns');

    // Read and execute add_valuation_and_sales.sql
    console.log('Adding valuation and sales columns...');
    const addValuationSQL = fs.readFileSync(path.join(__dirname, 'add_valuation_and_sales.sql'), 'utf8');
    await pool.query(addValuationSQL);
    console.log('✓ Added valuation and sales columns');

    // Read and execute update_6000_broadway_details.sql
    console.log('Updating 6000 SW Broadway details...');
    const update6000SQL = fs.readFileSync(path.join(__dirname, 'update_6000_broadway_details.sql'), 'utf8');
    await pool.query(update6000SQL);
    console.log('✓ Updated 6000 SW Broadway details');

    // Read and execute populate_all_properties.sql
    console.log('Populating all properties...');
    const populateAllSQL = fs.readFileSync(path.join(__dirname, 'populate_all_properties.sql'), 'utf8');
    await pool.query(populateAllSQL);
    console.log('✓ Populated all properties');

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.position) console.error('Position:', error.position);
    process.exit(1);
  }
}

runMigration();

