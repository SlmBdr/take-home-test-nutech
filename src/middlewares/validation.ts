import { Request, Response, NextFunction } from 'express';

// Simple email regex validation
export function isValidEmail(email: any): boolean {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRegistration(req: Request, res: Response, next: NextFunction) {
  const { email, first_name, last_name, password } = req.body;

  if (!email || !first_name || !last_name || !password) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter tidak lengkap',
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter email tidak sesuai format', // Match exact spelling from Swagger
      data: null,
    });
  }

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      status: 102,
      message: 'Password minimal 8 karakter',
      data: null,
    });
  }

  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter tidak lengkap',
      data: null,
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter email tidak sesuai format', // Match exact spelling from Swagger
      data: null,
    });
  }

  next();
}

export function validateTopUp(req: Request, res: Response, next: NextFunction) {
  const { top_up_amount } = req.body;

  // Validate that top_up_amount is a number and not negative
  // It must be numeric. Checking typeof or using number parsing
  if (
    top_up_amount === undefined ||
    top_up_amount === null ||
    typeof top_up_amount !== 'number' ||
    isNaN(top_up_amount) ||
    top_up_amount < 0
  ) {
    return res.status(400).json({
      status: 102,
      message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0', // Match exact spelling from Swagger
      data: null,
    });
  }

  next();
}

export function validateTransaction(req: Request, res: Response, next: NextFunction) {
  const { service_code } = req.body;

  if (!service_code || typeof service_code !== 'string') {
    return res.status(400).json({
      status: 102,
      message: 'Service atau Layanan tidak boleh kosong',
      data: null,
    });
  }

  next();
}
