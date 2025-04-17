import { createClient } from '@redis/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory path (ESM alternative to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../../.env') });

const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

export const connectRedis = async () => {
  const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST || 'localhost',
      port: parseInt(REDIS_PORT || '6379'),
    }
  });
  console.log('REDIS CREDENTIALS', REDIS_PASSWORD, REDIS_HOST, REDIS_PORT );

  client.on('error', (err) => console.error('Redis Client Error:', err));

  try {
    await client.connect();
    console.log('Connected to Redis successfully');

    // Test connection
    await client.set('connection_test', 'success');
    const result = await client.get('connection_test');
    console.log('Test result:', result);
    return client;
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  }
};

await connectRedis().catch(console.error);