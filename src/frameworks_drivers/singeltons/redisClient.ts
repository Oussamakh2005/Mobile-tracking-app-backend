import { createClient, RedisClientType } from "redis";

const redisClient  : RedisClientType = createClient();
//if theres an expected error
redisClient.on("error", (err) => console.error("Redis Client Error", err));
//connect client to redis
redisClient.connect();

export default redisClient;