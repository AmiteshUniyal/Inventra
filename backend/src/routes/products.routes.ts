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
import { validate } from "../middlewares/zod.middleware";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";

const router = Router();

router.get("/", authMiddleware, getProducts);
router.post("/", authMiddleware, allowRoles("ADMIN", "MANAGER"), departmentGuard, validate(createProductSchema), createProduct);
router.put("/:id", authMiddleware, allowRoles("ADMIN", "MANAGER", "STAFF"), departmentGuard, validate(updateProductSchema), updateProduct);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteProduct);

export default router;
