import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { db } from '../database';

export interface AuthenticatedUser {
  id: string;
  loginId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'ACCOUNTANT' | 'STAFF' | 'PARENT' | 'STUDENT' | 'GUEST';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authorization token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired authentication session' });
  }
}

export function requireRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthenticated request' });
      return;
    }

    if (req.user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Role ${req.user.role} is not authorized for this resource.`
      });
      return;
    }

    next();
  };
}
