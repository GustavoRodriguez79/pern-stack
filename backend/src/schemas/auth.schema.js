import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string({ error: "El email es obligatorio" }).email("Email inválido"),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const signinSchema = z.object({
  email: z.string({ error: "El email es obligatorio" }).email("Email inválido"),
  password: z.string({ error: "La contraseña es obligatoria" }).min(1, "La contraseña es obligatoria"),
});
