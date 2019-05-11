// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@": "test" });
const { Decimal } = require("decimal.js");

/**
 * 插入系统奖池表
 * @param { String[] } systemAccount 
 */
async function insertSystemAccount(systemAccount) {
    try {
        let valuesStr = ``
        for (let i = 0; i < systemAccount.length; i++) {
            let account = systemAccount[i];
            let amount = new Decimal(0).toFixed(8);
            let id = i + 1;
            let str = `('${ id }', '${ account }', ${ amount }),`
            valuesStr += str;
        }

        // 去除末尾的逗号
        valuesStr = valuesStr.replace(/,$/, "");
        // 如果重复则不再插入，直接返回
        let querySql = `
            insert into system_pools (
                id, pool_type, pool_amount
            )
            values ${ valuesStr }
            on conflict(pool_type) do nothing;
        `
        logger.info("insert test data to system_pools table");
        await pool.query(querySql);
        logger.info("insert ok");
    } catch (err) {
        throw err;
    }
    
}

// 删除所有的表
async function dropAllTable() {
    try {
        // 如果重复则不再插入，直接返回
        let querySql = `
            drop table if exists account;
            drop table if exists sub_account;
            drop table if exists account_op;
            drop table if exists balance;
            drop table if exists balance_log;
            drop table if exists referrer;
            drop table if exists system_pools;
            drop table if exists system_op_log;
        `
        logger.info("drop all table");
        await pool.query(querySql);
        logger.info("drop ok");
    } catch (err) {
        throw err;
    }
    
}

module.exports = {
    "insertSystemAccount": insertSystemAccount,
    "dropAllTable": dropAllTable,
}
