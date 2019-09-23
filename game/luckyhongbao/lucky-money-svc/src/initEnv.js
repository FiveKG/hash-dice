//@ts-check

var config = require("../config.js");

/**
 * 设置环境变量
 * 如果环境变量里没有对应的配置值， 那么就从配置文件里，读取配置值并设置到环境变量里。
 */
function initEnv() {
    /** LUCKY_MONEY_DB */
    if(!process.env.LUCKY_MONEY_DB_HOST){
        process.env.LUCKY_MONEY_DB_HOST = config.db.host ;
    }
    if(!process.env.LUCKY_MONEY_DB_PORT){
        process.env.LUCKY_MONEY_DB_PORT = config.db.port.toString();
    }
    if(!process.env.LUCKY_MONEY_DB_USER){
        process.env.LUCKY_MONEY_DB_USER = config.db.user;
    }
    if(!process.env.LUCKY_MONEY_DB_PASS){
        process.env.LUCKY_MONEY_DB_PASS = config.db.password;
    }
    if(!process.env.LUCKY_MONEY_DB_NAME){
        process.env.LUCKY_MONEY_DB_NAME = config.db.database;
    } 
    
    /** LUCKY_MONEY_REDIS */
    if(!process.env.LUCKY_MONEY_REDIS_HOST){
        process.env.LUCKY_MONEY_REDIS_HOST = config.redis.host
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