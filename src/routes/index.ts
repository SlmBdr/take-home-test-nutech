import { Router } from 'express';
import {
  registration,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
  upload,
} from '../controllers/membership.controller.js';
import { getBanners, getServices } from '../controllers/information.controller.js';
import {
  getBalance,
  topUp,
  makePayment,
  getTransactionHistory,
} from '../controllers/transaction.controller.js';
import { authMiddleware } from '../middlewares/auth.js';
import {
  validateRegistration,
  validateLogin,
  validateTopUp,
  validateTransaction,
} from '../middlewares/validation.js';

const router = Router();

// Module Membership
router.post('/registration', validateRegistration, registration);
router.post('/login', validateLogin, login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile/update', authMiddleware, updateProfile);
router.put('/profile/image', authMiddleware, upload.single('file'), updateProfileImage);

// Module Information
router.get('/banner', getBanners);
router.get('/services', authMiddleware, getServices);

// Module Transaction
router.get('/balance', authMiddleware, getBalance);
router.post('/topup', authMiddleware, validateTopUp, topUp);
router.post('/transaction', authMiddleware, validateTransaction, makePayment);
router.get('/transaction/history', authMiddleware, getTransactionHistory);

export default router;
