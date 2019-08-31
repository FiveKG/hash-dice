// @ts-check
const logger = require("../../common/logger.js").child({ "@models/trade/updateTrade.js": "更新交易信息" });

/**
 * 更新交易信息
 * @param { any } client 指定的数据库实例
 * @param { string } id 交易 id
 * @param { string } state 交易状态
 * @param { string } finished_time 交易完成时间
 */
async function updateTrade(client, id, state, finished_time) {
    try {
        const sql = `
            UPDATE trade SET state = $1, finished_time = $2 WHERE id = $3
        `
        await client.query(sql, [ state, finished_time, id ]);
    } catch (err) {
        logger.error("update trade data error, the error stock is %O", err);
        throw err;
    }
}

module.exports = updateTrade;