import { Router } from "express";
import {createStore, joinStore, login, logout, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/create-store", createStore);
router.post("/join-store", joinStore);
router.post("/login", login);

router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;
