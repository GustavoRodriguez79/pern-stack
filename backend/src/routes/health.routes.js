import Router from "express-promise-router";
import { pool } from "../db/db.js";

const router = Router();

// TEST 2: ¿Responde el servidor Express?
router.get("/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

// TEST 3: ¿Express llega a PostgreSQL?
router.get("/db", async (req, res) => {
  const { rows } = await pool.query("SELECT NOW() AS ahora");
  res.json({ message: "Conexión a la base de datos OK", time: rows[0].ahora });
});

export default router;
