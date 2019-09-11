// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/tbg1Airdrop.js": "参加 tbg1 空投" });
const { Decimal } = require("decimal.js");
const { TBG_TOKEN_COIN, TBG_FREE_POOL } = require("../common/constant/accountConstant.js");
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { format } = require("date-fns");


/**
 * 参加 tbg1 空投
 * @param {{ account: DataInfo, referrer?: DataInfo }} data
 */
async function tbg1Airdrop(data) {
    try {
        const trxList = [];
        if (!data.account) {
            return;
        }
        const dataList = [ data.account ]
        if (!!data.referrer) {
            dataList.push(data.referrer);
        }
        let sql = `
            INSERT INTO 
                balance_log(account_name, change_amount, current_balance, op_type, extra, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6, $7);
        `
        // 减去用户释放池资产，更新可售余额
        const updateBalanceSql = `
            UPDATE tbg_balance 
                SET release_amount = release_amount + $1, 
                    sell_amount = sell_amount + $2,  
                    active_amount = active_amount + $3
                WHERE account_name = $4
        `
        logger.debug("dataList: ", dataList);
        for (const info of dataList) {
            const opts = [ info.account_name, info.release_amount, info.current_balance, info.op_type, info.extra, info.remark, 'now()' ]

            trxList.push({
                sql: sql,
                values: opts
            });

            const updateOpts = [ info.release_amount, info.sell_amount, info.active_amount, info.account_name ]

            trxList.push({
                sql: updateBalanceSql,
                values: updateOpts
            });
        }
        // 用户参加 tbg1，由发币账号转至释放池账号
        const actionList = dataList.map(it => {
            return {
                account: TBG_TOKEN_COIN,
                name: "transfer",
                authorization: [{
                    actor: TBG_TOKEN_COIN,
                    permission: 'active',
                }],
                data: {
                    from: TBG_TOKEN_COIN,
                    to: TBG_FREE_POOL,
                    quantity: `${ new Decimal(it.release_amount).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                    memo: `${ format(it.create_time, "YYYY-MM-DD : HH:mm:ssZ") } tbg1 airdrop`
                }
            }
        });
        let flag = false;
        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
            flag = true;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }

        // 发送区块链转帐消息
        if (flag) {
            await psTrx.pub(actionList);
        }
    } catch (err) {
        logger.error("tbg1 airdrop error, the error stock is %O", err);
        throw err;
    }
}

module.exports = tbg1Airdrop

/**
 * @description
 * @typedef { object } DataInfo
 * @property { string } account_name
 * @property { number } release_amount
 * @property { number } sell_amount
 * @property { number } active_amount
 * @property { number } current_balance
 * @property { string } op_type
 * @property { object } extra
 * @property { string } remark
 * @property { Date } create_time
 */