import { Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "./auth.middleware";

export const departmentGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User context missing" });
    }

    const role = req.user.role;
    const storeId = req.user.storeId;
    const userDeptId = req.user.departmentId;

    if (role === "ADMIN") return next();

    let targetDeptId: string | null = null;

    const paramId = req.params.id;

    if (paramId) {
      if (req.originalUrl.includes('/department/')) {
        targetDeptId = paramId;
      } 
      else {
        const product = await prisma.product.findUnique({
          where: { id: paramId },
          select: { departmentId: true, department: { select: { storeId: true } } },
        });

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (product.department.storeId !== storeId) {
          return res.status(403).json({ message: "Access denied: Product belongs to another store" });
        }

        targetDeptId = product.departmentId;
      }
    } 
    else if (req.body.departmentId) {
      targetDeptId = req.body.departmentId;
    }
    if (!targetDeptId) {
      return res.status(400).json({ message: "Department context could not be determined" });
    }

    if (!userDeptId || userDeptId !== targetDeptId) {
      return res.status(403).json({ 
        message: "Access Denied: You do not have permission for this department" 
      });
    }

    next();
  } catch (error: any) {
    console.error("CRITICAL GUARD ERROR:", error.message || error);
    return res.status(500).json({ 
      message: "Internal Server Error in Security Guard",
    });
  }
};