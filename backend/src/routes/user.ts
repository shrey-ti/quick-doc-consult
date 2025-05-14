import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { getOrCreateUserByPhone } from '../controllers/user';

const router = Router();

// Get or create user by phone number
router.post(
  '/lookup',
  [
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('user_type').isIn(['doctor', 'patient']).withMessage('User type must be either doctor or patient'),
  ],
  validateRequest,
  getOrCreateUserByPhone
);

export default router; 