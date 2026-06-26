import app from './app.js';
import config from './config/index.js';
import logger from './logger/index.js';
import connectDB from './database/connection.js';

let server;

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();

    // Start Express Server
    server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });

    // Handle port in use error gracefully
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`Port ${config.port} is already in use. Please kill the process using that port and try again.`);
        process.exit(1);
      }
      throw err;
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Graceful shutdown on SIGTERM/SIGINT (prevents zombie processes)
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
      // Force kill after 5s if graceful shutdown fails
      setTimeout(() => process.exit(1), 5000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer(); 
