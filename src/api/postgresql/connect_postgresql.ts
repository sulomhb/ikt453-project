import pkg from 'pg';
const { Client } = pkg;
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export async function connectPostgreSQL() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    config({ path: join(__dirname, '../../../.env') });

    const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = process.env;
    
    const client = new Client({
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
        port: parseInt(POSTGRES_PORT || '5432'),
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL successfully');
        // Test connection
        await client.query('SELECT NOW()');
        console.log('PostgreSQL connection test successful');
        return client;
    } catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        throw error;
    }
}