// @ts-check
const logger = require("../common/logger.js").child({ "@": "线性释放" });
const { MEMBER_LEVEL_TRX } = require("../common/constant/assetsConstant.js");
const { Decimal } = require("decimal.js");
const { userMember } = require("../common/userMember.js");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const { ACCOUNT_INACTIVATED } = require("../common/constant/accountConstant");
const { pool } = require("../db");
const { scheduleJob } = require("node-schedule");

/**
 * 所有进入释放池的TBG，从次日0:00开始释放
 */
async function releaseAssets() {
    try {
        let selectAccountLevelSql = `
            SELECT (SELECT count(1) as count FROM referrer r
                        JOIN account a ON r.account_name = a.account_name
                        AND a.state != ${ ACCOUNT_INACTIVATED }
                    ) AS count, account_name
                FROM account
        `
        let { rows: memberInfo } = await pool.query(selectAccountLevelSql);
        const memberMap = new Map();
        for (const info of memberInfo) {
            memberMap.set(info.account_name, info.count);
        }
        
        const trxList = [];
        const { rows: tbgBalanceInfo } = await pool.query("SELECT * FROM tbg_balance");
        const now = new Date();
        for (const info of tbgBalanceInfo) {
            const levelInfo = userMember(memberMap.get(info.account_name));
            // 当前会员等级的释放比例
            const releaseRate = MEMBER_LEVEL_TRX[levelInfo.ID].RELEASE_RATE;
            // 释放池资产额度
            const releaseAmount = new Decimal(info.release_amount);
            // 可释放的额度
            const dayRelease = releaseAmount.mul(releaseRate);
            let sql = `
                INSERT INTO 
                    balance_log(account_name, change_amount, current_balance, op_type, extra， remark, create_time)
                    VALUES($1, $2, $3, $4, $5, $6, $7);
            `
            const remark = `user ${ info.account_name } at ${ now } release assets ${ dayRelease.toFixed(8) }`
            const opts = [ info.account_name, dayRelease, releaseAmount.minus(dayRelease), OPT_CONSTANTS.RELEASE, {}, remark, now ]

            trxList.push({
                sql: sql,
                values: opts
            });
        }

        const client = await pool.connect();
        await client.query("BEGIN");
        try {
            await Promise.all(trxList.map(it => {
                client.query(it.sql, it.values);
            }));
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            await client.release();
        }
    } catch (err) {
        logger.error("release assets error, the error stock is %O", err);
        throw err;
    }
}

logger.debug(`releaseAssets running...`);
// 每天 0：00 派奖
scheduleJob("0 0 0 */1 * *", releaseAssets);

module.exports = releaseAssets;