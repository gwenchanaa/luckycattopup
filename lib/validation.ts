import { z } from "zod";

const idFieldSchema = z
  .string()
  .trim()
  .min(3, "Minimal 3 karakter")
  .max(32, "Maksimal 32 karakter")
  .regex(/^[a-zA-Z0-9#._ -]+$/, "Hanya boleh huruf, angka, dan simbol umum");

export const createOrderSchema = z.object({
  gameCode: z.string().min(1),
  productCode: z.string().min(1),
  accountUserId: idFieldSchema,
  accountServerId: idFieldSchema.optional(),
});

export const validateIdSchema = z.object({
  gameCode: z.string().min(1),
  accountUserId: idFieldSchema,
  accountServerId: idFieldSchema.optional(),
});

export const transactionIdParamSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^TX-[A-Z0-9]{12}$/, "Format Transaction ID tidak valid");
