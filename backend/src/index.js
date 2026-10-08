import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // permite enviar/recibir la cookie del JWT
  })
);
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo de errores (los errores async llegan acá gracias a express-promise-router)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 API escuchando en http://localhost:${port}`);
});
