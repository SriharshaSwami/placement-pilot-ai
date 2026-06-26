import mongoose from 'mongoose';
import logger from '../logger/index.js';
import config from '../config/index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
