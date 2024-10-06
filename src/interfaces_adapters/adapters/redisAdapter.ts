import { RedisClientType } from "redis";

class RedisAdapter {

    constructor(private redisClient : RedisClientType) {}

    async get(key : string) : Promise<string | null> {
        return await this.redisClient.get(key)
    }
    async set(key : string , value : string) : Promise<void> {
        await this.redisClient.set(key,value,{"EX" : 3600});
    }
    async del(key : string) : Promise<void> {
        await this.redisClient.del(key);
    }
}

export default RedisAdapter;