import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({ error: "El título es obligatorio" })
    .min(1, "El título es obligatorio")
    .max(150, "El título admite hasta 150 caracteres"),
  description: z.string().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(150, "El título admite hasta 150 caracteres")
    .optional(),
  description: z.string().optional(),
  done: z.boolean().optional(),
});
