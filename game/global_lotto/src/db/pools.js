// @ts-check
const { Pool } = require("pg");
const { db } = require("../../config.js");

const port = process.env.GLOBAL_LOTTO_DB_PORT || db.port
// 数据库配置
var dbConfig = {  
    user: process.env.GLOBAL_LOTTO_DB_USER || db.user,
    host: process.env.GLOBAL_LOTTO_DB_HOST || db.host,
    database: process.env.GLOBAL_LOTTO_DB_NAME || db.database,
    password: process.env.GLOBAL_LOTTO_DB_PASS || db.password,
    port: Number(port),

    // 扩展属性
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 3000, // 连接最大空闲时间 3s
}

let pool = new Pool(dbConfig);

pool.query("SELECT now()").then(rows => {
    console.debug("rows: ", rows);
})
module.exports = pool