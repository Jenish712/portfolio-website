import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type Role = 'viewer' | 'editor' | 'admin';

export interface AuthUser {
  sub: string;
  role: Role;
}

export function requireAuth(roles: Role[] = ['viewer']) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
    const token = header.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as AuthUser;
      (req as any).user = payload;
      if (!roles.includes(payload.role)) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
