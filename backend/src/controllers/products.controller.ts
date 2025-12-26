import { Response } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        department: {
          storeId: req.user!.storeId,
        },
      },
    });

    res.json(products);
  } catch {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, productCode, quantity, departmentId } = req.body;

    if (!name || !productCode || quantity == null || !departmentId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const status = quantity === 0 ? "OUT_OF_STOCK" : quantity < 10 ? "LOW_STOCK" : "IN_STOCK";

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

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to create product" });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const status = quantity === 0 ? "OUT_OF_STOCK" : quantity < 10 ? "LOW_STOCK" : "IN_STOCK";

    const product = await prisma.product.update({
      where: { id },
      data: {
        quantity,
        status,
        updatedById: req.user!.userId,
      },
    });

    res.json(product);
  } catch {
    res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
