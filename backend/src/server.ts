import app from './app';
import { config } from './config';
import { connectDB } from './config/database';
import { logger } from './utils/logger';


const startServer = async () => {
  try {
    // Connect to Supabase
    await connectDB();
    
    // Start server
    app.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
