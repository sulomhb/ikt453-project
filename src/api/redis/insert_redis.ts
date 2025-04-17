import { connectRedis } from "./connect_redis.ts";

// REDIS
export async function insertRedis(): Promise<any> {
    const redisClient = await connectRedis();
    const insertSucess = await redisClient.sAdd('clinical_data:disease:exema', 'cancer:1')
    if(insertSucess &&  insertSucess > 0) {
        console.log("insert success:", insertSucess);
    } else {
        console.log("insert failed:", insertSucess);
    }
    redisClient.disconnect();
    return insertSucess;
}
await insertRedis();