import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    
    try {
        schema.parse(req.body);
        next();
    } 
    catch {
        return res.status(400).json({message: "Validation error"});
    }
};
