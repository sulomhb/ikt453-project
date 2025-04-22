import { connectRedis } from './connect_redis.ts';

export async function deleteRedis(key: string): Promise<any> {
  try {
    const client = await connectRedis();

    // Check if the key exists before attempting to delete it
    const exists = await client.exists(key);
    if (!exists) {
      client.disconnect();
      return { success: false, message: 'Key does not exist', key };
    }

    const result = await client.del(key);
    client.disconnect();

    // Check if the deletion was successful
    return { success: result > 0, key };
  } catch (err) {
    console.error('Redis delete error:', err);
    throw err;
  }
}