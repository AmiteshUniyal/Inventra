import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../utils/prismaClient";
import { generateStoreCode } from "../utils/generateStoreCode";
import { generateToken } from "../utils/generateJWT";

//create-store
export const createStore = async (req: Request, res: Response) => {
  try {
    const { storeName, adminName, email, password } = req.body;

    const existingAdmin = await prisma.user.findFirst({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const storeCode = generateStoreCode();

    await prisma.store.create({
      data: {
        name: storeName,
        code: storeCode,
        users: {
          create: {
            name: adminName,
            email,
            password: hashedPassword,
            role: "ADMIN",
          },
        },
      },
    });

    return res.status(201).json({
      message: "Store created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//join-store
export const joinStore = async (req: Request, res: Response) => {
  try {
    const { storeCode, name, email, password, role } = req.body;

    const store = await prisma.store.findUnique({
      where: { code: storeCode },
      select: { id: true },
    });

    if (!store) {
      return res.status(404).json({ message: "Invalid store code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        storeId: store.id,
      },
    });

    return res.status(201).json({
      message: "User joined store successfully",
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists in store" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { storeCode, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
        store: { code: storeCode },
      },
      select: {
        id: true,
        role: true,
        storeId: true,
        password: true,
        departmentId: true,
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      userId: user.id,
      role: user.role,
      storeId: user.storeId,
      departmentId: user.departmentId,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token,
      role: user.role,
      departmentId: user.departmentId,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//me
import { AuthRequest } from "../middlewares/auth.middleware";

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        storeId: true,
        departmentId: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//logout
export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  return res.status(200).json({ message: "Logged out" });
};
