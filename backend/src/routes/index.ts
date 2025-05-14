import { Router } from 'express';
import consultationRoutes from './consultation';
import userRoutes from './user';
import doctorRoutes from './doctor';

const router = Router();

// Health check route
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// User routes
router.use('/users', userRoutes);

// Consultation routes
router.use('/consultations', consultationRoutes);

// Doctor routes
router.use('/doctors', doctorRoutes);

// TODO: Add more route modules here
// Example:
// router.use('/auth', authRoutes);
// router.use('/appointments', appointmentRoutes);

export default router; 