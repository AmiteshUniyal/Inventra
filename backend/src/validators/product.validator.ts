import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  productCode: z.string().min(3),
  quantity: z.number().int().nonnegative(),
  departmentId: z.string().uuid(),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  productCode: z.string().optional(),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
  departmentId: z.string().uuid().optional(),
});