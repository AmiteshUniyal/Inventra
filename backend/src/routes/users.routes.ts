import { Router } from "express";
import { 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/rbac.middleware";
import { validate } from "../middlewares/zod.middleware";
import { createUserSchema, updateUserSchema } from "../validators/user.validator";

const router = Router();

router.get(
  "/",
  authMiddleware,
  allowRoles("ADMIN", "MANAGER"),
  getUser
);

router.post(
  "/",
  authMiddleware,
  allowRoles("ADMIN"),
  validate(createUserSchema),
  createUser
);

router.put(
  "/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  validate(updateUserSchema),
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("ADMIN"),
  deleteUser
);

export default router;