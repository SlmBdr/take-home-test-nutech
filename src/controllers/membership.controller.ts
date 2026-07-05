import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { query } from '../db/index.js';

// Setup multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    // Check MIME type
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export async function registration(req: AuthenticatedRequest, res: Response) {
  const { email, first_name, last_name, password } = req.body;

  try {
    // Check if user already exists
    const checkUser = await query(
      'SELECT email FROM users WHERE email = $1',
      [email],
      'check-user-exists'
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        status: 102,
        message: 'Email sudah terdaftar',
        data: null,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await query(
      'INSERT INTO users (email, first_name, last_name, password, balance) VALUES ($1, $2, $3, $4, 0)',
      [email, first_name, last_name, hashedPassword],
      'insert-user'
    );

    return res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  try {
    // Find user
    const result = await query(
      'SELECT email, password FROM users WHERE email = $1',
      [email],
      'find-user-login'
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const user = result.rows[0];

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    // Generate token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured in environment variables');
    }
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: '12h' });

    return res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;

  try {
    const result = await query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1',
      [email],
      'get-user-profile'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    const user = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profile_image = user.profile_image ? `${baseUrl}/uploads/${user.profile_image}` : null;

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: profile_image,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;
  const { first_name, last_name } = req.body;

  try {
    const result = await query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3 RETURNING email, first_name, last_name, profile_image',
      [first_name, last_name, email],
      'update-user-profile'
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'User tidak ditemukan',
        data: null,
      });
    }

    const user = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profile_image = user.profile_image ? `${baseUrl}/uploads/${user.profile_image}` : null;

    return res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil', // Matches Swagger spelling exactly
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: profile_image,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}

export async function updateProfileImage(req: AuthenticatedRequest, res: Response) {
  const email = req.userEmail;

  // Multer populates req.file if fileFilter approved the MIME type and file was uploaded
  if (!req.file) {
    return res.status(400).json({
      status: 102,
      message: 'Format Image tidak sesuai', // Custom Swagger message
      data: null,
    });
  }

  try {
    // Get existing user to delete their old profile image if it exists
    const userResult = await query('SELECT profile_image FROM users WHERE email = $1', [email]);
    if (userResult.rows.length > 0 && userResult.rows[0].profile_image) {
      const oldPath = path.join('./uploads', userResult.rows[0].profile_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save filename to database
    const filename = req.file.filename;
    const result = await query(
      'UPDATE users SET profile_image = $1 WHERE email = $2 RETURNING email, first_name, last_name, profile_image',
      [filename, email],
      'update-user-profile-image'
    );

    const user = result.rows[0];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const profile_image = `${baseUrl}/uploads/${user.profile_image}`;

    return res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: profile_image,
      },
    });
  } catch (error) {
    console.error('Update profile image error:', error);
    // Cleanup uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: null,
    });
  }
}
