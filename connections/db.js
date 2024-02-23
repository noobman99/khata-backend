const mssql = require("mssql");

require("dotenv").config();

const config = {
  user: process.env.MSSQL_DB_USER,
  password: process.env.MSSQL_DB_PASS,
  server: process.env.MSSQL_DB_HOST,
  database: process.env.MSSQL_DB_NAME,
  port: process.env.MSSQL_DB_PORT,
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

const pool = new mssql.ConnectionPool(config);

module.exports = pool;
