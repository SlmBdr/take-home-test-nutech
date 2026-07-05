import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  userEmail?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers.token as string;
  
  if (!token) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null,
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }
    const decoded = jwt.verify(token, secret) as { email: string };
    
    if (!decoded || !decoded.email) {
      return res.status(401).json({
        status: 108,
        message: 'Token tidak tidak valid atau kadaluwarsa',
        data: null,
      });
    }

    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null,
    });
  }
}
