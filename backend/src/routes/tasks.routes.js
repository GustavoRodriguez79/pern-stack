import Router from "express-promise-router";
import {
  listarTareas,
  listarTarea,
  crearTarea,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/tasks.controller.js";
import { validateSchema } from "../middlewares/validate.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema.js";

const router = Router();

// Todas las rutas de tareas exigen sesión iniciada.
router.use(isAuth);

// Rechaza ids que no sean números enteros antes de llegar a la base.
router.param("id", (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ message: "El id debe ser numérico" });
  next();
});

router.get("/", listarTareas);
router.get("/:id", listarTarea);
router.post("/", validateSchema(createTaskSchema), crearTarea);
router.put("/:id", validateSchema(updateTaskSchema), actualizarTarea);
router.delete("/:id", eliminarTarea);

export default router;
