import { Router } from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";

const router = Router();

router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, allowRoles("ADMIN"), createDepartment);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), updateDepartment);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteDepartment);

export default router;
