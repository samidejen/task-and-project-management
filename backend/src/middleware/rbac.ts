import { Request, Response, NextFunction } from 'express';

// Define roles for type safety
export enum Role {
  Admin = 'Admin',
  ProjectManager = 'ProjectManager',
  Employee = 'Employee',
}

// Extend the Express Request interface for authenticated user data
export interface AuthRequest extends Request {
  user?: { id: number; role: Role; iat: number; exp: number };
}

// Middleware function to check if the user's role is in the allowed list
export const checkRole = (allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Auth middleware should have populated req.user
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required. Role not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log the forbidden attempt (optional)
      console.log(`Forbidden attempt: User ${req.user.id} with role ${req.user.role} tried to access a restricted route.`);
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }

    next();
  };
};