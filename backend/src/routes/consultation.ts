import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { createConsultation, getAvailableDoctors, getDoctorAvailability } from '../controllers/consultation';

const router = Router();

// Get available doctors based on specialization
router.get('/doctors', getAvailableDoctors);

// Get doctor's availability for a specific date
router.get('/doctors/:doctorId/availability', getDoctorAvailability);

// Create a consultation
router.post(
  '/bookings',
  [
    body('doctor_id').notEmpty().withMessage('Doctor ID is required'),
    body('appointment_date').isDate().withMessage('Invalid appointment date'),
    body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time'),
    body('consultation_type').isIn(['video', 'audio', 'chat', 'in_person', 'whatsapp']).withMessage('Invalid consultation type'),
    body('symptoms').notEmpty().withMessage('Symptoms are required'),
    body('patient.phone_number').notEmpty().withMessage('Patient phone number is required'),
  ],
  validateRequest,
  createConsultation
);

export default router; 