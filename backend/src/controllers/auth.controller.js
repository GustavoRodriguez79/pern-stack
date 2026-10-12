import bcrypt from "bcrypt";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

const cookieOptions = {
  httpOnly: true, // JavaScript del navegador no puede leer la cookie
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 24, // 1 día
};

const crearToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // bcrypt protege la contraseña: se guarda el hash, nunca el texto plano.
  const hashedPassword = await bcrypt.hash(password, 10);
  // md5 se usa solo para construir la URL del avatar de Gravatar.
  const gravatar = `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;

  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, gravatar)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, gravatar`,
      [name, email, hashedPassword, gravatar]
    );

    const user = rows[0];
    res.cookie("token", crearToken(user), cookieOptions);
    res.status(201).json(user);
  } catch (error) {
    // 23505 = violación de UNIQUE en PostgreSQL (email repetido)
    if (error.code === "23505") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    throw error;
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = rows[0];

  // Mismo mensaje para email inexistente y clave incorrecta: no revela qué falló.
  const valid = user && (await bcrypt.compare(password, user.password));
  if (!valid) return res.status(401).json({ message: "Credenciales incorrectas" });

  res.cookie("token", crearToken(user), cookieOptions);
  res.json({ id: user.id, name: user.name, email: user.email, gravatar: user.gravatar });
};

export const signout = (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
  res.json({ message: "Sesión cerrada" });
};

export const profile = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, email, gravatar, created_at FROM users WHERE id = $1",
    [req.user.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(rows[0]);
};
