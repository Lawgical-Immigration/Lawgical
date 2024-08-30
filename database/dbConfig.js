const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const poolKey = process.env.POOL_KEY;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lawgicaldb',
  password: 'newpassword',
  port: 5432,
})

module.exports = pool;