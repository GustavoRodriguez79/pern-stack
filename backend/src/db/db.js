import pg from "pg";

// Un único pool de conexiones para toda la app.
// Si existe DATABASE_URL (por ejemplo en Railway) se usa; si no, las variables DB_*.
export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
  : new pg.Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
