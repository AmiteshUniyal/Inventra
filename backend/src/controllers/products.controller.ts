import { Response } from "express";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId, role, departmentId } = req.user!;

    const page = parseInt(req.query.page as string) || 1;
    const status = req.query.status as string;
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {
      department: {
        storeId: storeId,
        id: role !== "ADMIN" ? departmentId ?? undefined : undefined,
      },
    };

    if (status) {
      whereClause.status = status;
    }

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          department: { select: { name: true } },
          updatedBy: { select: { name: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: skip,
        take: limit,
      }),
      prisma.product.count({ where: whereClause }),
    ]);

    res.json({
      items: products,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, productCode, quantity, departmentId } = req.body;

    const existing = await prisma.product.findUnique({
      where: { productCode_departmentId: { productCode, departmentId } },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Product code already exists in this department" });
    }

    const status =
      quantity === 0
        ? "OUT_OF_STOCK"
        : quantity < 10
        ? "LOW_STOCK"
        : "IN_STOCK";

    const product = await prisma.product.create({
      data: {
        name,
        productCode,
        quantity,
        status,
        departmentId,
        updatedById: req.user!.userId,
      },
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user!;
    const { quantity, name, productCode, departmentId } = req.body;

    let updateData: any = { quantity, updatedById: userId };

    if (role === "ADMIN" || role === "MANAGER") {
      if (name) updateData.name = name;
      if (productCode) updateData.productCode = productCode;
      if (departmentId) updateData.departmentId = departmentId;
    }

    updateData.status =
      quantity === 0
        ? "OUT_OF_STOCK"
        : quantity < 10
        ? "LOW_STOCK"
        : "IN_STOCK";

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { storeId } = req.user!;

  try {
    const deleteResult = await prisma.product.deleteMany({
      where: {
        id: id,
        department: {
          storeId: storeId,
        },
      },
    });

    if (deleteResult.count === 0) {
      return res.status(404).json({
        message:
          "Product not found or you do not have permission to delete it from this store.",
      });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
