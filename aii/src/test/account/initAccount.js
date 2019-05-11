// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger.js").child({ "@src/test/test.js": "test" });
const uuidv4 = require("uuid/v4");
const { Decimal } = require("decimal.js");
const { getRandEOSAccount } = require("./genRandEosAccount.js");
const { getInviteCode } = require("./getInviteCode.js");

// 插入测试账户
async function insertAccount() {
    try {
        let { code, account} = await generateData(6);
        let querySql = `
            insert into account (
                id, account_name, refer_count, member_level, refer_code, create_time
            )
            values (
                '${ uuidv4() }', 'systemwallet', 1, 1, ${ code["code0"] }, now()
            ),(
                '${ uuidv4() }', 'yujinsheng11', 0, 1, ${ code["code1"] }, now()
            ),(
                '${ uuidv4() }', '${ account["account1"] }', 0, 1, ${ code["code2"] }, now()
            ),(
                '${ uuidv4() }', '${ account["account2"] }', 0, 1, ${ code["code3"] }, now()
            ),(
                '${ uuidv4() }', '${ account["account3"] }', 0, 1, ${ code["code4"] }, now()
            ),(
                '${ uuidv4() }', '${ account["account4"] }', 0, 1, ${ code["code5"] }, now()
            ),(
                '${ uuidv4() }', '${ account["account5"] }', 0, 1, ${ await getInviteCode() }, now()
            )
            on conflict(account_name) do nothing;

            insert into referrer values (
                '${ uuidv4() }', null, 'systemwallet', now()
            ),(
                '${ uuidv4() }', 'systemwallet', 'yujinsheng11', now()
            ),
            (
                '${ uuidv4() }', 'yujinsheng11', '${ account["account0"] }', now()
            ),
            (
                '${ uuidv4() }', 'yujinsheng11', '${ account["account1"] }', now()
            ),
            (
                '${ uuidv4() }', '${ account["account1"] }', '${ account["account2"] }', now()
            ),
            (
                '${ uuidv4() }', '${ account["account2"] }', '${ account["account3"] }', now()
            ),
            (
                '${ uuidv4() }', '${ account["account3"] }', '${ account["account4"] }', now()
            ),
            (
                '${ uuidv4() }', '${ account["account4"] }', '${ account["account5"] }', now()
            )
            on conflict(account_name) do nothing;

            insert into balance values (
                '${ uuidv4() }', 'systemwallet', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', 'yujinsheng11', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account0"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account1"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account2"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account3"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account4"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            ),
            (
                '${ uuidv4() }', '${ account["account5"] }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
            )
            on conflict(account_name) do nothing;

            update account set refer_count = 2 where account_name = 'yujinsheng11';
            update account set refer_count = 1 
                where account_name in 
                (
                    '${ account["account1"] }', 
                    '${ account["account2"] }', 
                    '${ account["account3"] }', 
                    '${ account["account4"] }', 
                    '${ account["account5"] }', 
                );
        `
        logger.info("insert test data to account table");
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
            insert into system_pools (
                id, pool_type, pool_amount
            )
            values (
                '1', 'safePool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '2', 'modePool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '3', 'sortPool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '4', 'pkPool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '5', 'bingoPool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '6', 'shareholdersPool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '7', 'communityPool', ${ new Decimal(0).toFixed(8) }
            ),
            (
                '8', 'devOpPool', ${ new Decimal(0).toFixed(8) }
            )
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
    let code = new Map();
    let account = new Map();
    for (let i = 0; i < num; i++) {
        code[`code${i}`] = await getInviteCode();
        account[`account${i}`] = getRandEOSAccount();
    }

    return {
        code: code,
        account: account
    }
}

/**
 * @typedef { Object } GenData 
 * @property { Map } code
 * @property { Map } account
 */

module.exports = {
    "insertAccount": insertAccount,
    "insertSystemPool": insertSystemPool,
    "dropAllTable": dropAllTable,
    "generateData": generateData,
}
