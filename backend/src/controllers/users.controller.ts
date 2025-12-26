import { Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createUser = async (req: AuthRequest, res: Response) => {
  
    const { name, email, password, role, departmentId } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["MANAGER", "STAFF"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        const exists = await prisma.user.findFirst({
            where: {
                email,
                storeId: req.user!.storeId,
            },
        });

        if (exists) {
            return res.status(409).json({message: "User already exists in store"});
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
    } 
    catch {
        return res.status(500).json({message: "Internal Server Error"});
    }
};
