const express = require("express");
const cors    = require("cors");
const pool    = require("./db");
const path    = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // sirve el HTML

// ── ESP32 envía aquí ────────────────────────────────────────────────────────
app.post("/data", async (req, res) => {
  const { temperatura, humedad } = req.body;
  if (temperatura === undefined)
    return res.status(400).json({ error: "falta temperatura" });

  const { rows } = await pool.query(
    "INSERT INTO lecturas (temperatura, humedad) VALUES ($1, $2) RETURNING *",
    [temperatura, humedad ?? null]
  );
  console.log("Nueva lectura:", rows[0]);
  res.status(201).json(rows[0]);
});

// ── Frontend consume esto ───────────────────────────────────────────────────
app.get("/api/lecturas", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM lecturas ORDER BY ts DESC LIMIT 50"
  );
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));