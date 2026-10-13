import { pool } from "../db/db.js";

export const listarTareas = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC",
    [req.user.id]
  );
  res.json(rows);
};

export const listarTarea = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(rows[0]);
};

export const crearTarea = async (req, res) => {
  const { title, description } = req.body;
  // RETURNING hace que PostgreSQL devuelva la fila creada en la misma consulta.
  const { rows } = await pool.query(
    "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [req.user.id, title, description ?? null]
  );
  res.status(201).json(rows[0]);
};

export const actualizarTarea = async (req, res) => {
  const { title, description, done } = req.body;
  const { rows } = await pool.query(
    `UPDATE tasks
        SET title       = COALESCE($1, title),
            description = COALESCE($2, description),
            done        = COALESCE($3, done)
      WHERE id = $4 AND user_id = $5
      RETURNING *`,
    [title ?? null, description ?? null, done ?? null, req.params.id, req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Tarea no encontrada" });
  res.json(rows[0]);
};

export const eliminarTarea = async (req, res) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2",
    [req.params.id, req.user.id]
  );
  if (result.rowCount === 0) return res.status(404).json({ message: "Tarea no encontrada" });
  res.status(204).send();
};
