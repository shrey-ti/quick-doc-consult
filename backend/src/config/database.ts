import { createClient } from '@supabase/supabase-js';
import { config } from './index';
import { logger } from '../utils/logger';

// Check if Supabase credentials are provided
if (!config.supabaseUrl || !config.supabaseKey) {
  logger.error('Missing Supabase credentials in environment variables');
  logger.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

// Create a singleton Supabase client
export const supabase = createClient(config.supabaseUrl, config.supabaseKey);

export const connectDB = async (): Promise<void> => {
  try {
    // Test the connection
    const { error } = await supabase.from('patients').select('*').limit(1);
    
    if (error) {
      throw error;
    }
    
    logger.info('Connected to Supabase');
  } catch (error) {
    logger.error('Supabase connection error:', error);
    process.exit(1);
  }
}; 