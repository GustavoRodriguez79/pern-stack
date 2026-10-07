import { pool } from "./db.js";

// TEST 1: ¿Node se conecta a PostgreSQL?
try {
  const { rows } = await pool.query("SELECT NOW() AS ahora, current_database() AS db");
  console.log("✅ Conexión a PostgreSQL OK");
  console.log(`   Base de datos: ${rows[0].db}`);
  console.log(`   Hora del servidor: ${rows[0].ahora.toISOString()}`);
} catch (error) {
  console.error("❌ No se pudo conectar a PostgreSQL:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
