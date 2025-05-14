import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Create a new doctor with consultation types
 */
export const createDoctor = async (req: Request, res: Response): Promise<void> => {
  const { 
    phone_number,
    name,
    category_id,
    photo_url,
    experience_years,
    consultation_count,
    about,
    consultation_types
  } = req.body;

  try {
    // Start a transaction
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .insert({
        phone_number,
        name,
        category_id: category_id || null,
        photo_url: photo_url || null,
        experience_years: experience_years || 0,
        consultation_count: consultation_count || 0,
        about: about || null
      })
      .select()
      .single();

    if (doctorError) {
      logger.error('Error creating doctor:', doctorError);
      res.status(400).json({ 
        success: false, 
        message: 'Failed to create doctor',
        error: doctorError.message 
      });
      return;
    }

    // Insert consultation types
    const consultationData = consultation_types.map((type: any) => ({
      doctor_phone: phone_number,
      consultation_type: type.type,
      price: type.price
    }));

    const { error: consultationError } = await supabase
      .from('doctor_consultation_types')
      .insert(consultationData);

    if (consultationError) {
      logger.error('Error creating consultation types:', consultationError);
      
      // If consultation types fail, delete the doctor to maintain consistency
      await supabase.from('doctors').delete().eq('phone_number', phone_number);
      
      res.status(400).json({ 
        success: false, 
        message: 'Failed to create doctor consultation types',
        error: consultationError.message 
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: {
        doctor,
        consultation_types: consultationData
      }
    });
  } catch (error: any) {
    logger.error('Error in createDoctor:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 