import { Router } from "express";
import { getOverview, getDepartmentDashboard } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";
import { departmentGuard } from "../middlewares/department.guard";

const router = Router();

router.get("/overview", authMiddleware, allowRoles("ADMIN"), getOverview);

router.get("/department/:id", authMiddleware, allowRoles("ADMIN", "MANAGER", "STAFF"), departmentGuard, getDepartmentDashboard);

export default router;
