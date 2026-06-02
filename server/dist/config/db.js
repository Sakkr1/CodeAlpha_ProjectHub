import mongoose from 'mongoose';
import { logger } from '../shared/logger.js';
import { env } from './env.js';
export async function connectDB() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info('Connected to MongoDB');
    }
    catch (error) {
        logger.error('MongoDB connection error', { error });
        process.exit(1);
    }
}
//# sourceMappingURL=db.js.map