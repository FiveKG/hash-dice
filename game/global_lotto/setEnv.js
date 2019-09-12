// @ts-check
const config = require("./config");

function setEnv() {
  if (!process.env.CONSUL_URL) {
    process.env.CONSUL_URL = "http://localhost:8500";
  }

  if(!process.env.GLOBAL_LOTTO_DB_HOST){
    process.env.GLOBAL_LOTTO_DB_HOST = config.db.host ;
  }
  if(!process.env.GLOBAL_LOTTO_DB_PORT){
      process.env.GLOBAL_LOTTO_DB_PORT = config.db.port.toString();
  }
  if(!process.env.GLOBAL_LOTTO_DB_USER){
      process.env.GLOBAL_LOTTO_DB_USER = config.db.user;
  }
  if(!process.env.GLOBAL_LOTTO_DB_PASS){
      process.env.GLOBAL_LOTTO_DB_PASS = config.db.password;
  }
  if(!process.env.GLOBAL_LOTTO_DB_NAME){
      process.env.GLOBAL_LOTTO_DB_NAME = config.db.database;
  }
  if(!process.env.GLOBAL_LOTTO_REDIS_HOST){
      process.env.GLOBAL_LOTTO_REDIS_HOST = config.redis.host;
  }
  if(!process.env.GLOBAL_LOTTO_REDIS_PORT){
      process.env.GLOBAL_LOTTO_REDIS_PORT = config.redis.port.toString();
  }
  if(!process.env.GLOBAL_LOTTO_REDIS_PASS){
      process.env.GLOBAL_LOTTO_REDIS_PASS = config.redis.auth;
  }
  if(!process.env.GLOBAL_LOTTO_RABBIT_PASS){
      process.env.GLOBAL_LOTTO_RABBIT_PASS = config.rabbitmq.pwd;
  }
  if(!process.env.GLOBAL_LOTTO_RABBIT_PORT){
      process.env.GLOBAL_LOTTO_RABBIT_PORT = config.rabbitmq.port.toString();
  }
  if(!process.env.GLOBAL_LOTTO_RABBIT_HOST){
      process.env.GLOBAL_LOTTO_RABBIT_HOST = config.rabbitmq.host;
  }
  if(!process.env.GLOBAL_LOTTO_RABBIT_USER){
      process.env.GLOBAL_LOTTO_RABBIT_USER = config.rabbitmq.user;
  }
}

module.exports = setEnv;
