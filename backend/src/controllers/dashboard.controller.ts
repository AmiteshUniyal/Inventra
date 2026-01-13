import { Response } from "express";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getOverview = async (req: AuthRequest, res: Response) => {
  try {
    const storeId = req.user?.storeId;

    const departmentsData = await prisma.department.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true,
          },
        },
        products: {
          select: {
            status: true,
          },
        },
      },
    });

    const overview = departmentsData.map((dept) => {
      const totalProducts = dept._count.products;

      const lowStock = dept.products.filter(
        (p) => p.status === "LOW_STOCK"
      ).length;

      const outOfStock = dept.products.filter(
        (p) => p.status === "OUT_OF_STOCK"
      ).length;

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        stats: {
          totalProducts,
          lowStock,
          outOfStock,
          inStock: totalProducts - (lowStock + outOfStock),
        },
      };
    });

    const storeWideTotals = overview.reduce(
      (acc, curr) => ({
        totalProducts: acc.totalProducts + curr.stats.totalProducts,
        lowStock: acc.lowStock + curr.stats.lowStock,
        outOfStock: acc.outOfStock + curr.stats.outOfStock,
      }),
      { totalProducts: 0, lowStock: 0, outOfStock: 0 }
    );

    res.json({
      storeId,
      summary: storeWideTotals,
      departments: overview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load admin overview" });
  }
};

export const getDepartmentDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const departmentId = req.params.id;

    // 1. Get Department Name
    const dept = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { name: true },
    });

    // 2. Get Product Stats
    const stats = await prisma.product.groupBy({
      by: ["status"],
      where: { departmentId },
      _count: { _all: true },
    });

    // 3. Format data for the Frontend
    const result = {
      departmentName: dept?.name || "Unknown",
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    };

    stats.forEach((item) => {
      const count = item._count._all;
      result.totalProducts += count;

      if (item.status === "IN_STOCK") result.inStock = count;
      if (item.status === "LOW_STOCK") result.lowStock = count;
      if (item.status === "OUT_OF_STOCK") result.outOfStock = count;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load department dashboard" });
  }
};
