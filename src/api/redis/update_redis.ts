import { connectRedis } from './connect_redis.ts';

export async function updateRedis(data: { key: string; value: any }): Promise<any> {
  try {
    const client = await connectRedis();

    // Ensure the key exists before updating
    const exists = await client.exists(data.key);
    if (!exists) {
      client.disconnect();
      return { success: false, message: 'Key does not exist' };
    }

    // Logging the value to check what is being passed
    console.log('Updating Redis with value:', data.value);

    // Use hSet to update fields
    const result = await client.hSet(data.key, data.value);

    console.log('hSet result:', result); // Log the result of hSet to see what Redis is returning

    client.disconnect();

    // If result > 0, it means one or more fields were added/updated
    return { success: result > 0, key: data.key, value: data.value };
  } catch (err) {
    console.error('Redis update error:', err);
    throw err;
  }
}