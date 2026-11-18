require('dotenv').config();
const { Pool, types } = require('pg');

// DATE tetap berupa string 'YYYY-MM-DD'
types.setTypeParser(1082, (v) => v);

module.exports = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5433,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD ?? ''),
  database: process.env.DB_NAME,
});
