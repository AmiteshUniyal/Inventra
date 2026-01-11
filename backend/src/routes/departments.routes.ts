import { Router } from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/zod.middleware";
import { createDepartmentSchema, updateDepartmentSchema } from "../validators/department.validator";

const router = Router();

router.get("/", authMiddleware, getDepartments);
router.post("/", authMiddleware, allowRoles("ADMIN"), validate(createDepartmentSchema), createDepartment);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), validate(updateDepartmentSchema), updateDepartment);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteDepartment);

export default router;
