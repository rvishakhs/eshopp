import Redis from "ioredis";

// Setting uo the redis database connection
const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD 

})

export default redis;