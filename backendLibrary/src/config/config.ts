import dotenv from 'dotenv';

dotenv.config();

export const config = {
    database: {
        url: process.env.DATABASE_URL,
    },
    server: {
        port: Number(process.env.PORT),
    },
};