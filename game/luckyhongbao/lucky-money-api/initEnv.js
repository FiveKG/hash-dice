//@ts-check
var config = require("./envConfig");

/**
 * 设置环境变量
 */
function initEnv() {
    if(!process.env.LUCKY_MONEY_DB_HOST){
        process.env.LUCKY_MONEY_DB_HOST = config.db.host ;
    }
    if(!process.env.LUCKY_MONEY_DB_PORT){
        process.env.LUCKY_MONEY_DB_PORT = config.db.port.toString();
    }
    if(!process.env.LUCKY_MONEY_DB_USER){
        process.env.LUCKY_MONEY_DB_USER = config.db.username;
    }
    if(!process.env.LUCKY_MONEY_DB_PASS){
        process.env.LUCKY_MONEY_DB_PASS = config.db.password;
    }
    if(!process.env.LUCKY_MONEY_DB_NAME){
        process.env.LUCKY_MONEY_DB_NAME = config.db.database;
    }
    if(!process.env.LUCKY_MONEY_REDIS_HOST){
        process.env.LUCKY_MONEY_REDIS_HOST = config.redis.host;
    }
    if(!process.env.LUCKY_MONEY_REDIS_PORT){
        process.env.LUCKY_MONEY_REDIS_PORT = config.redis.port.toString();
    }
    if(!process.env.LUCKY_MONEY_REDIS_PASS){
        process.env.LUCKY_MONEY_REDIS_PASS = config.redis.auth;
    }
    /** LUCKY_MONEY_RABBIT */
    if(!process.env.LUCKY_MONEY_RABBIT_HOST){
        process.env.LUCKY_MONEY_RABBIT_HOST = config.rabbitmq.host ;
    }
    if(!process.env.LUCKY_MONEY_RABBIT_PORT){
        process.env.LUCKY_MONEY_RABBIT_PORT = config.rabbitmq.port.toString();
    }
    if(!process.env.LUCKY_MONEY_RABBIT_USER){
        process.env.LUCKY_MONEY_RABBIT_USER = config.rabbitmq.user;
    }
    if(!process.env.LUCKY_MONEY_RABBIT_PASS){
        process.env.LUCKY_MONEY_RABBIT_PASS = config.rabbitmq.pwd;
    }
}

module.exports = initEnv;