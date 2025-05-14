import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || '856dba06f710f9629fbf49e58f80970f82ad9e45b75f28b02bf09d6c22809999b69e03b07fc1d53f39adc14caaee3393efb60b976b59b06be2705d1f0c9e2028',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  logLevel: process.env.LOG_LEVEL || 'debug',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_ANON_KEY || '',
} as const; 