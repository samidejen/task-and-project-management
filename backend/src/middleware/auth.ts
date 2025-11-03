import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "./rbac";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    // 1️⃣ Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Check httpOnly cookie if no header token
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token." });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
      iat: number;
      exp: number;
    };

    // Attach user info to request
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Not authorized, token failed." });
  }
};
