// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/test/test.js": "test" });
const uuidv4 = require("uuid/v4");
const { getRandEOSAccount } = require("../../build/account/genRandEosAccount");
const { getGeneralInviteCode, getGlobalInviteCode } = require("../../build/inviteCode/genInviteCode");

// 插入测试账户
async function insertAccount() {
    try {
        let { code, account } = await generateData(6);
        let querySql = `
            insert into account(id, account_name, refer_count, state, refer_code, account_type, create_time)
                values ('${ uuidv4() }', 'systemwallet', 1, 0, '${ code[0] }', 'general', 'now()'),
                ('${ uuidv4() }', 'yujinsheng11', 0, 0, '${ code[1] }', 'general', 'now()'),
                ('${ uuidv4() }', '${ account[1] }', 0, 0, '${ code[2] }', 'general', 'now()'),
                ('${ uuidv4() }', '${ account[2] }', 0, 0, '${ code[3] }', 'general', 'now()'),
                ('${ uuidv4() }', '${ account[3] }', 0, 0, '${ code[4] }', 'general', 'now()'),
                ('${ uuidv4() }', '${ account[4] }', 0, 0, '${ code[5] }', 'general', 'now()'),
                ('${ uuidv4() }', '${ account[5] }', 0, 0, '${ await getGeneralInviteCode() }', 'general', 'now()')
                on conflict(account_name) do nothing;

            insert into referrer values ('${ uuidv4() }', '', 'systemwallet', 'now()'),
                ('${ uuidv4() }', 'systemwallet', 'yujinsheng11', 'now()'),
                ('${ uuidv4() }', 'yujinsheng11', '${ account[0] }', 'now()'),
                ('${ uuidv4() }', 'yujinsheng11', '${ account[1] }', 'now()'),
                ('${ uuidv4() }', '${ account[1] }', '${ account[2] }', 'now()'),
                ('${ uuidv4() }', '${ account[2] }', '${ account[3] }', 'now()'),
                ('${ uuidv4() }', '${ account[3] }', '${ account[4] }', 'now()'),
                ('${ uuidv4() }', '${ account[4] }', '${ account[5] }', 'now()')
                on conflict(account_name) do nothing;

            insert into balance(id, account_name, create_time) 
                values ('${ uuidv4() }', 'systemwallet', 'now()'),
                ('${ uuidv4() }', 'yujinsheng11', 'now()'),
                ('${ uuidv4() }', '${ account[0] }', 'now()'),
                ('${ uuidv4() }', '${ account[1] }', 'now()'),
                ('${ uuidv4() }', '${ account[2] }', 'now()'),
                ('${ uuidv4() }', '${ account[3] }', 'now()'),
                ('${ uuidv4() }', '${ account[4] }', 'now()'),
                ('${ uuidv4() }', '${ account[5] }', 'now()')
                on conflict(account_name) do nothing;

            update account set refer_count = 2 where account_name = 'yujinsheng11';
            update account set refer_count = 1 where account_name in 
                ('${ account[1] }', '${ account[2] }', 
                    '${ account[3] }', 
                    '${ account[4] }', 
                    '${ account[5] }'
                );
        `
        // logger.info("insert test data to account table, the sql is %s", querySql);
        await pool.query(querySql);
        logger.info("insert ok");
    } catch (err) {
        throw err;
    }
}

// 插入系统奖池表
async function insertSystemPool() {
    try {
        // 如果重复则不再插入，直接返回
        let querySql = `
            insert into system_pools (id, pool_type, pool_amount)
            values ('1', 'safePool', 0),
            ('2', 'modePool', 0),
            ('3', 'sortPool', 0),
            ('4', 'pkPool', 0),
            ('5', 'bingoPool', 0),
            ('6', 'shareholdersPool', 0),
            ('7', 'communityPool', 0),
            ('8', 'devOpPool', 0)
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

/**
 * 构造帐号和推荐码
 * @param { Number } num 要生成的个数
 * @returns { Promise<GenData> }
 */
async function generateData(num) {
    let code = [];
    let account = [];
    for (let i = 0; i < num; i++) {
        code[i] = await getGeneralInviteCode();
        account[i] = getRandEOSAccount();
    }

    return {
        code: code,
        account: account
    }
}

/**
 * @typedef { Object } GenData 
 * @property { Array } code
 * @property { Array } account
 */

module.exports = {
    "insertAccount": insertAccount,
    "insertSystemPool": insertSystemPool,
    "dropAllTable": dropAllTable,
    "generateData": generateData,
}
