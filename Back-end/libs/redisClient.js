import redis from "redis";

const redisClient = redis.createClient({
  url: "redis://red-d1bpu63e5dus73erkemg:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

await redisClient.connect();

export default redisClient;
