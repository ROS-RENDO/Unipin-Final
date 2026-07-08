const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://unipin:unipinpassword@localhost:5432/unipin_db',
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('[DB] Connected to PostgreSQL successfully!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
