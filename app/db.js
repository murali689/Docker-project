const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "database",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "usersdb",
  user: process.env.DB_USER || "usersadmin",
  password: process.env.DB_PASSWORD || "changeme"
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;