import { connectRedis } from "./connect_redis.ts";

// REDIS
export async function deleteRedis(): Promise<any> {
    const redisClient = await connectRedis();
    const deleteSucess = await redisClient.del("sample_restaurant:49");
    if(deleteSucess > 0) {
        console.log("Delete success:", deleteSucess);
    } else {
        console.log("Delete failed:", deleteSucess);
    }
    redisClient.disconnect();
    return deleteSucess;
}
await deleteRedis();