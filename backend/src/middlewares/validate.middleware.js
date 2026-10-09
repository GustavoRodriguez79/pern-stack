// Aseguramos que lo que viene del cliente sea correcto: valida req.body con un esquema de zod.
export const validateSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.issues.map((i) => ({
        campo: i.path.join("."),
        mensaje: i.message,
      })),
    });
  }
  req.body = result.data;
  next();
};
