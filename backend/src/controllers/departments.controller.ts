import { Response } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";


export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const { role, storeId, userId } = req.user!;

    if (role === "ADMIN") {
      const departments = await prisma.department.findMany({
        where: { storeId },
      });
      return res.json(departments);
    }

    const department = await prisma.department.findFirst({
      where: {
        storeId,
        OR: [{ managerId: userId }, { users: { some: { id: userId } } }],
      },
    });

    res.json(department ? [department] : []);
  } 
  catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const createDepartment = async (req: AuthRequest, res: Response) => {
  const { name, managerId } = req.body;

  if (!name || !managerId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const department = await prisma.department.create({
        data: {
            name,
            managerId,
            storeId: req.user!.storeId,
        },
    });
    res.status(201).json(department);
  } 
  catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



export const updateDepartment = async (req: AuthRequest, res: Response) => {
  
  const { id } = req.params;
  const { name, managerId } = req.body;

  try {
    const department = await prisma.department.update({
        where: { id },
        data: { name, managerId },
    });
    res.json(department);
  } 
  catch {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDepartment = async (req: AuthRequest, res: Response) => {
  
  const { id } = req.params;

  try {
    await prisma.department.delete({ where: { id } });
    res.json({ message: "Department deleted" });
  } 
  catch {
    return res.status(500).json({ message: "Internal Server Error" });  
  }
};
