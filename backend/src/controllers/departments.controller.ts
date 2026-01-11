import { Response } from "express";
import prisma from "../../prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";


export const getDepartments = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId } = req.user!;
    
    const departments = await prisma.department.findMany({
      where: { storeId },
      select: {
        id: true,
        name: true,
        manager: {
          select: { name: true }
        },
        _count: {
          select: { products: true, users: true }
        }
      }
    });
    
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateDepartment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, managerId } = req.body;
  const { storeId } = req.user!;

  try {
    const department = await prisma.department.updateMany({
      where: { id, storeId }, 
      data: { name, managerId },
    });
    
    if (department.count === 0) return res.status(404).json({ message: "Department not found" });
    
    res.json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Check if manager is already assigned elsewhere" });
  }
};



export const createDepartment = async (req: AuthRequest, res: Response) => {
  const { name, managerId } = req.body;

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
