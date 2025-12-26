import { Response, NextFunction } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "./auth.middleware";

export const departmentGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, userId, storeId } = req.user!;

    if (role === "ADMIN") return next();

    let departmentId: string | null = req.body.departmentId || null;


    if (!departmentId && req.params.id) {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        select: {
          departmentId: true,
          department: { select: { storeId: true } },
        },
      });

      if (!product || product.department.storeId !== storeId) {
        return res.status(403).json({ message: "Access denied" });
      }

      departmentId = product.departmentId;
    }

    if (!departmentId) {
      return res.status(400).json({ message: "Department missing" });
    }

    if (role === "MANAGER") {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        select: { managerId: true }
      });

      if (!department || department.managerId !== userId) {
        return res.status(403).json({ message: "Not your department" });
      }
    }

    if (role === "STAFF") {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { departmentId: true },
      });

      if (!user || user.departmentId !== departmentId) {
        return res.status(403).json({ message: "Not your department" });
      }
    }

    next();
  } 
  catch {
    return res.status(500).json({ message: "DepartmentGuard failed" });
  }
};
