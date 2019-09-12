// @ts-check
const Redis = require('ioredis');
const config = require("../../config.js");

const host = config.redis.host;
const port = config.redis.port;
const auth = config.redis.auth;

const redis = new Redis(port, host, { 
  "password": auth ,
  "showFriendlyErrorStack": true , 
  "db": 5,
  "keepAlive": 10000 , 
  "connectionName": "hash-dice" , 
  "autoResubscribe": true
});

//console.log(redis)
module.exports = redis;