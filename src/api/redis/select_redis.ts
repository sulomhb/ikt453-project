import { connectRedis } from './connect_redis.ts';

export async function selectRedis(key: string): Promise<any> {
  try {
    const client = await connectRedis();
    
    // Use hGetAll instead of get for hash entries
    const value = await client.hGetAll(key);
    client.disconnect();

    return Object.keys(value).length > 0 ? value : null;
  } catch (err) {
    console.error('Redis select error:', err);
    throw err;
  }
}