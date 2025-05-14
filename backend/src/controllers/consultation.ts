import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AppointmentRequest } from '../types';
import { supabase } from '../config/database';
import { logger } from '../utils/logger';

export const getAvailableDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { specialization } = req.query;

    let query = supabase
      .from('doctors')
      .select('*');

    if (specialization) {
      // Assuming we're filtering by category name
      const { data: categories, error: categoryError } = await supabase
        .from('doctor_categories')
        .select('id')
        .eq('name', specialization)
        .single();

      if (categoryError && categoryError.code !== 'PGRST116') {
        logger.error('Error fetching category:', categoryError);
        throw new AppError('Error fetching category', 500);
      }

      if (categories) {
        query = query.eq('category_id', categories.id);
      }
    }

    const { data: doctors, error } = await query;

    if (error) {
      logger.error('Error fetching doctors:', error);
      throw new AppError('Error fetching doctors', 500);
    }

    return res.json(doctors);
  } catch (error) {
    next(error);
    return undefined;
  }
};

export const getDoctorAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      throw new AppError('Date is required', 400);
    }

    // In the provided schema, we don't have doctor_availability table
    // Let's check existing consultations for the given doctor and date

    const { data: consultations, error } = await supabase
      .from('consultations')
      .select('booking_time')
      .eq('doctor_phone', doctorId)
      .eq('booking_date', date)
      .eq('status', 'scheduled');

    if (error) {
      logger.error('Error fetching consultations:', error);
      throw new AppError('Error fetching consultations', 500);
    }

    // Assuming working hours are 9 AM to 5 PM
    // We could have this as a configurable option or from the doctor's data
    const workingHours = {
      start: 9, // 9 AM
      end: 17,  // 5 PM
    };

    // Create available time slots (1 hour each for this example)
    const availableSlots = [];
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      const slotTime = `${hour.toString().padStart(2, '0')}:00`;
      
      // Check if the slot is booked
      const isBooked = consultations.some(
        (consultation: any) => consultation.booking_time === slotTime
      );

      if (!isBooked) {
        availableSlots.push({
          time: slotTime,
          is_available: true
        });
      }
    }

    return res.json(availableSlots);
  } catch (error) {
    next(error);
    return undefined;
  }
};

export const createConsultation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const appointmentData: AppointmentRequest = req.body;
    
    // First ensure patient exists
    const patientMobile = appointmentData.patient?.phone_number;
    
    if (!patientMobile) {
      throw new AppError('Patient phone number is required', 400);
    }
    
    // Check if patient exists, if not create
    const { data: existingPatient, error: patientCheckError } = await supabase
      .from('patients')
      .select('mobile_number')
      .eq('mobile_number', patientMobile)
      .single();
      
    if (patientCheckError && patientCheckError.code !== 'PGRST116') {
      logger.error('Error checking patient:', patientCheckError);
      throw new AppError('Error checking patient record', 500);
    }
    
    // Create patient if doesn't exist
    if (!existingPatient) {
      const { error: createPatientError } = await supabase
        .from('patients')
        .insert({ mobile_number: patientMobile });
        
      if (createPatientError) {
        logger.error('Error creating patient:', createPatientError);
        throw new AppError('Error creating patient record', 500);
      }
    }
    
    // Generate a unique booking reference
    const bookingReference = Math.random().toString(36).substring(2, 12).toUpperCase();
    
    // Create the consultation
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .insert({
        patient_mobile: patientMobile,
        doctor_phone: appointmentData.doctor_id, // Using doctor_id as phone_number
        booking_date: appointmentData.appointment_date,
        booking_time: appointmentData.start_time,
        consultation_type: appointmentData.consultation_type,
        status: 'scheduled',
        symptoms: appointmentData.symptoms,
        booking_reference: bookingReference
      })
      .select()
      .single();

    if (consultationError) {
      logger.error('Error creating consultation:', consultationError);
      throw new AppError('Error creating consultation', 500);
    }

    return res.status(201).json({
      message: 'Consultation booked successfully',
      consultation
    });
  } catch (error) {
    next(error);
    return undefined;
  }
}; 