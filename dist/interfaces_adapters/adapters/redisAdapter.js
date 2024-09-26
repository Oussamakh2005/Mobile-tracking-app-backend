class RedisAdapter {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async get(key) {
        return await this.redisClient.get(key);
    }
    async set(key, value) {
        await this.redisClient.set(key, value, { "EX": 3600 });
    }
    async del(key) {
        await this.redisClient.del(key);
    }
}
export default RedisAdapter;
