import mongoose from 'mongoose';
import { config } from '../config/config';

export const connectToDatabase = async () => {
    try {
        if (!config.database.url) {
            throw new Error('Database URL is not defined');
        }
        await mongoose.connect(config.database.url);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};
