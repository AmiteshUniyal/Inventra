import { z } from "zod";

export const createStoreSchema = z.object({
  storeName: z.string().min(2),
  adminName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export const joinStoreSchema = z.object({
  storeCode: z.string().min(3),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["MANAGER", "STAFF"]),
});

export const loginSchema = z.object({
  storeCode: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});
