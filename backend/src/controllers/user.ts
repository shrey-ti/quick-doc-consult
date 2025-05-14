import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { UserRequest, UserResponse } from '../types';
import { logger } from '../utils/logger';
import { supabase } from '../config/database';

/**
 * Get or create a user by phone number and type
 */
export const getOrCreateUserByPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  try {
    const { phone_number, user_type }: UserRequest = req.body;

    if (!phone_number || !user_type) {
      throw new AppError('Phone number and user type are required', 400);
    }

    if (!['doctor', 'patient'].includes(user_type)) {
      throw new AppError('User type must be either doctor or patient', 400);
    }

    // Check if user exists based on user type
    let existingUser = null;
    let exists = false;

    if (user_type === 'doctor') {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('phone_number', phone_number)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        logger.error('Error fetching doctor:', error);
        throw new AppError('Error fetching doctor information', 500);
      }
      
      if (data) {
        existingUser = data;
        exists = true;
      }
    } else { // patient
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('mobile_number', phone_number)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error fetching patient:', error);
        throw new AppError('Error fetching patient information', 500);
      }
      
      if (data) {
        existingUser = data;
        exists = true;
      }
    }

    // User already exists, return it
    if (exists && existingUser) {
      const response: UserResponse = {
        phone_number: existingUser.phone_number || existingUser.mobile_number,
        user_type,
        created_at: existingUser.created_at,
        exists: true
      };
      
      // Add doctor-specific fields if it's a doctor
      if (user_type === 'doctor') {
        response.name = existingUser.name;
        response.category_id = existingUser.category_id;
        response.experience_years = existingUser.experience_years;
        response.price = existingUser.price;
        response.about = existingUser.about;
        response.photo_url = existingUser.photo_url;
      }

      return res.status(200).json(response);
    }

    // User doesn't exist, create a new one
    let newUser;
    
    if (user_type === 'doctor') {
      const { data, error } = await supabase
        .from('doctors')
        .insert({
          phone_number,
          name: '', // Default empty, to be updated later
          category_id: null, // Default null, to be updated later
          experience_years: 0,
          rating: 0.0,
          consultation_count: 0,
          price: 0.0,
          about: ''
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Error creating doctor:', error);
        throw new AppError('Error creating doctor', 500);
      }
      
      newUser = data;
    } else { // patient
      const { data, error } = await supabase
        .from('patients')
        .insert({
          mobile_number: phone_number
        })
        .select()
        .single();
      
      if (error) {
        logger.error('Error creating patient:', error);
        throw new AppError('Error creating patient', 500);
      }
      
      newUser = data;
    }

    const response: UserResponse = {
      phone_number: newUser.phone_number || newUser.mobile_number,
      user_type,
      created_at: newUser.created_at,
      exists: false
    };
    
    // Add doctor-specific fields if it's a doctor
    if (user_type === 'doctor') {
      response.name = newUser.name;
      response.category_id = newUser.category_id;
      response.experience_years = newUser.experience_years;
      response.price = newUser.price;
      response.about = newUser.about;
      response.photo_url = newUser.photo_url;
    }

    return res.status(201).json(response);
  } catch (error) {
    next(error);
    return undefined;
  }
}; 