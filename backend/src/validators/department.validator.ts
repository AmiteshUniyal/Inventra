import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  managerId: z.string().uuid(),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).optional(),
  managerId: z.string().uuid().optional(),
});
