import { config } from 'dotenv';

config();

export const { PORT, MONGO_URL, MONGO_DB_NAME, NODE_ENV } = process.env;
