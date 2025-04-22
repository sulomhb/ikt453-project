import { connectRedis } from './connect_redis.ts';

export async function insertRedis(data: { id: number; value: any }): Promise<any> {
    try {
      const client = await connectRedis();
      // Create the key as dimdiagnosis:x, where x is the ID
      const key = `dimdiagnosis:${data.value.Diagnosis_ID}`;
  
      // Check if the key already exists
      const exists = await client.exists(key);
      if (exists) {
        client.disconnect();
        return { success: false, message: 'Key already exists' };
      }
  
      // Use hSet to store the fields inside the hash
      const result = await client.hSet(key, data.value);
      client.disconnect();
  
      // hSet returns the number of fields added or updated, check if > 0 to confirm success
      return { success: result > 0, key: key, value: data.value };
    } catch (err) {
      console.error('Redis insert error:', err);
      throw err;
    }
  }