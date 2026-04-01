const { Pool } = require("pg");

module.exports = new Pool({
  connectionString: "postgresql://postgres:admin@localhost:5432/prueba-esp32",
  ssl: { rejectUnauthorized: false }
});