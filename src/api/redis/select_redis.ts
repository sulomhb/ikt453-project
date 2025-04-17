import { connectRedis } from "./connect_redis.ts";

// REDIS
export async function selectRedis(): Promise<any> {
    const redisClient = await connectRedis();
    const selectSucess = await redisClient.hGetAll('SuleymanSelcuk');
    if(selectSucess) {
        console.log("select success:", selectSucess);
    } else {
        console.log("select failed:", selectSucess);
    }
    redisClient.disconnect();
    return selectSucess;
}
await selectRedis();