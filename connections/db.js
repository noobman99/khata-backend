const mysql2 = require("mysql2");
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.SQL_DB_HOST,
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASS,
  database: process.env.SQL_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
