// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@": "test" });
const { generate_primary_key } = require("../../common")
const { Decimal } = require("decimal.js");
const { UE_TOKEN_SYMBOL, TBG_TOKEN_SYMBOL } = require("../../common/constant/eosConstants.js");

/**
 * 插入系统奖池表
 * @param { String[] } systemAccount 
 */
async function insertSystemAccount(systemAccount) {
    try {
        let valuesStr = [];
        for (let i = 0; i < systemAccount.length; i++) {
            let account = systemAccount[i];
            let amount = new Decimal(0).toFixed(8);
            valuesStr.push(`('${ generate_primary_key() }', '${ account }', ${ amount }, '${ UE_TOKEN_SYMBOL }')`);
        }

        // 如果重复则不再插入，直接返回
        let querySql = `
            WITH new_values (id, pool_type, pool_amount, pool_symbol) 
                AS (values ${ valuesStr.join(",") })
              INSERT INTO system_pools (id, pool_type, pool_amount, pool_symbol)
              SELECT id, pool_type, pool_amount, pool_symbol
              FROM new_values
              WHERE NOT EXISTS (SELECT 1 
                                FROM system_pools
                                WHERE system_pools.pool_type = new_values.pool_type AND system_pools.pool_symbol = new_values.pool_symbol)
        `
        // logger.info("insert test data to system_pools table, sql is %s", querySql);
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
            drop table if exists balance;
            drop table if exists referrer;
            drop table if exists balance_log;
            drop table if exists system_pools;
            drop table if exists system_op_log;
            drop table if exists account_op;
            drop table if exists trade;
            drop table if exists trade_log;
            drop table if exists tbg_balance;
            drop table if exists assets_package;
            drop table if exists snapshot;
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
