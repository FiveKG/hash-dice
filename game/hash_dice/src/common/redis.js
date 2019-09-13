// @ts-check
const Redis = require('ioredis');
const config = require("../../config.js");

const host = process.env.HASH_DICE_REDIS_HOST || config.redis.host;
const port = process.env.HASH_DICE_REDIS_PORT || config.redis.port;
const auth = process.env.HASH_DICE_REDIS_PASS || config.redis.auth;

const redis = new Redis(Number(port), host, { 
  "password": auth ,
  "showFriendlyErrorStack": true , 
  "db": 5,
  "keepAlive": 10000 , 
  "connectionName": "wallet_tbg" , 
  "autoResubscribe": true
});

//console.log(redis)
module.exports = redis;