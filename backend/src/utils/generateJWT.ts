import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: string;
  storeId: string;
  departmentId: string | null;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env['JWT_SECRET'] as string, { expiresIn: "1d" });
};