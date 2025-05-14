import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { createDoctor } from '../controllers/doctor';

const router = Router();

// Create a new doctor
router.post(
  '/create',
  [
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
    body('photo_url').optional().isURL().withMessage('Photo URL must be a valid URL'),
    body('experience_years').optional().isInt().withMessage('Experience years must be an integer'),
    body('about').optional().isString().withMessage('About must be a string'),
    body('consultation_types')
      .isArray({ min: 1 })
      .withMessage('At least one consultation type is required'),
    body('consultation_types.*.type')
      .isIn(['video', 'audio', 'chat', 'in_person', 'whatsapp'])
      .withMessage('Consultation type must be valid'),
    body('consultation_types.*.price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
  ],
  validateRequest,
  createDoctor
);

export default router; 