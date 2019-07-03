// @ts-check
const { Pool } = require("pg");
const { db } = require("../../config.js");

// 数据库配置
var dbConfig = {  
    user: db.user,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,

    // 扩展属性
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 3000, // 连接最大空闲时间 3s
}

let pool = new Pool(dbConfig);

module.exports = pool