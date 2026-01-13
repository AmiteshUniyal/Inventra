import { Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prismaClient";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createUser = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role, departmentId } = req.body;

  try {
    const exists = await prisma.user.findFirst({
      where: {
        email,
        storeId: req.user!.storeId,
      },
    });

    if (exists) {
      return res.status(409).json({ message: "User already exists in store" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        storeId: req.user!.storeId,
        departmentId: departmentId || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(201).json(user);
  } catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const { role, storeId, departmentId } = req.user!;

    if (role === "ADMIN") {
      const users = await prisma.user.findMany({
        where: { storeId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          departmentId: true,
          department: {
            select: { name: true },
          },
          createdAt: true,
        },
      });
      return res.status(200).json(users);
    } else if (role === "MANAGER") {
      if (!departmentId) {
        return res
          .status(400)
          .json({ message: "Manager is not assigned to a department" });
      }

      const users = await prisma.user.findMany({
        where: {
          storeId: storeId,
          departmentId: departmentId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { name: "asc" },
      });
      return res.status(200).json(users);
    }
    return res
      .status(403)
      .json({ message: "Forbidden: You do not have permission to view users" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const storeId = req.user?.storeId;

    if (id === req.user?.userId) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await prisma.user.findFirst({
      where: { id, storeId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
