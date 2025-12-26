import { Router } from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";
import { departmentGuard } from "../middlewares/department.guard";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, allowRoles("ADMIN", "MANAGER"), departmentGuard, createProduct);
router.put("/:id", authMiddleware, allowRoles("ADMIN", "MANAGER", "STAFF"), departmentGuard, updateProduct);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteProduct);

export default router;
