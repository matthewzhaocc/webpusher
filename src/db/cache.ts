import Redis from "ioredis";

const redis = new Redis({
  host: "redis-16347.c289.us-west-1-2.ec2.cloud.redislabs.com",
  port: 16347,
  password: process.env.REDIS_PASSWD,
});

export default redis;
