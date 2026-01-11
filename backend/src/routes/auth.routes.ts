import { Router } from "express";
import {createStore, joinStore, login, logout, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/zod.middleware";
import { createStoreSchema, joinStoreSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post("/create-store", validate(createStoreSchema), createStore);
router.post("/join-store", validate(joinStoreSchema), joinStore);
router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;
