import { Router } from "express";
import { createUser } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";

const router = Router();

router.post("/", authMiddleware, allowRoles("ADMIN"), createUser );

export default router;
