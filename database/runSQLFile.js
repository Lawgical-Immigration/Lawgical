const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Create a new PostgreSQL client using your Supabase credentials
const client = new Client({
  connectionString: 'postgresql://postgres.rtablgykpenwdujeiqgn:wqqfXVOq3L3HCYaQ@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
});

async function runSQLFile() {
  try {
    // Connect to the Supabase database
    await client.connect();

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL commands in the file
    await client.query(sql);

    console.log('SQL file executed successfully.');
  } catch (err) {
    console.error('Error executing SQL file:', err);
  } finally {
    // Close the database connection
    await client.end();
  }
}

runSQLFile();
