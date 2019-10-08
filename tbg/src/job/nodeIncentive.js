// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "节点激励池派奖" });
const { Decimal } = require("decimal.js");
const { getOneAccount } = require("../models/systemPool");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const INCOME_CONSTANT = require("../common/constant/incomeConstant");
const { NODE_INCENTIVE_POOL } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL, UE_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const df = require("date-fns");
const { scheduleJob } = require("node-schedule");
const storeIncome = require("../common/storeIncome.js");
const { redis } = require("../common");

logger.debug(`nodeIncentive running...`);
// 截止周一00:00
scheduleJob("0 0 0 * * 1", nodeIncentive);

/**
 * 节点激励池的30%作为每周奖金发放总额
 * 相应等级的用户在相应等级的奖金池获取奖金
 * 奖励依据为伞下新增用户计算获得奖金比例
 */
async function nodeIncentive() {
    // 获取到节点激励池的奖池额度
    const nodeIncentivePool = await getOneAccount(NODE_INCENTIVE_POOL);
    const nodeIncentivePoolAmount = new Decimal(nodeIncentivePool.pool_amount);
    if (nodeIncentivePoolAmount.eq(0)) {
        return;
    }
    // 找出达标大于 3 的用户
    const selectSnapshotSql = `SELECT * FROM snapshot AS tmpSnapshot WHERE account_grade != $1 OR account_grade != $2`;
    const { rows: snapshotList } = await pool.query(selectSnapshotSql, [ "v", "v0"]);
    await redis.set("tbg:snapshot", snapshotList);
    // 重置所有用户的周推荐人数量
    const updateSnapshotSql = `UPDATE snapshot SET invite_account_week = 0`;
    await pool.query(updateSnapshotSql);
    if (snapshotList.length === 0) {
        return;
    }
    // 本次分配的金额
    let distrEnable = nodeIncentivePoolAmount.mul(INCOME_CONSTANT.NODE_INCENTIVE_RATE / INCOME_CONSTANT.BASE_RATE);
    // 用户等级可得的比例
    const v1 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V1);
    const v2 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V2);
    const v3 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V3);
    const v4 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V4);
    const v5 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V5);
    const client = await pool.connect();
    await client.query("BEGIN");
    try {
        const accMap = new Map();
        // 统计每个等级的人数
        for (const accInfo of snapshotList) {
            const memberInfo = accMap.get(accInfo.account_grade);
            if (!!memberInfo) {
                memberInfo.accInfo.push({
                    account_name: accInfo.account_name,
                    invite_account_week: accInfo.invite_account_week
                });
                memberInfo.total = memberInfo.total + accInfo.invite_account_week;
            } else {
                accMap.set(accInfo.account_grade, {
                    accInfo: [
                        {
                        account_name: accInfo.account_name,
                        invite_account_week: accInfo.invite_account_week,

                    }],
                    total: accInfo.invite_account_week
                })
            }
        }

        // 计算收益
        let issued = new Decimal(0);
        for (const [ key, val ] of accMap) {
            if (key === "v1") {
                issued = await calIncome(val, v1, issued);
            } else if (key === "v2") {
                issued = await calIncome(val, v2, issued);
            } else if (key === "v3") {
                issued = await calIncome(val, v3, issued);
            } else if (key === "v4") {
                issued = await calIncome(val, v4, issued);
            }  else {
                issued = await calIncome(val, v5, issued);
            }
        }

        // 更新节点激励池额度
        const updateSysPoolSql = `UPDATE system_pools SET pool_amount = $1 WHERE pool_type = $2 AND pool_symbol = $3;`
        // 插入一条更新日志
        const insertSysOpLogSql = `
            INSERT INTO system_op_log(change_amount, current_balance, extra, op_type, remark, create_time)
                VALUES($1, $2, $3, $4, $5, $6);
        `
        const currentBalance = nodeIncentivePoolAmount.minus(issued);
        const remark = 'allocating node incentive pool bonus'
        const opts = [ issued, currentBalance, { "symbol": UE_TOKEN_SYMBOL, aid: NODE_INCENTIVE_POOL }, 'node', remark, 'now()' ];
        await client.query(updateSysPoolSql, opts);
        await client.query(insertSysOpLogSql, [ currentBalance, NODE_INCENTIVE_POOL, UE_TOKEN_SYMBOL ]);
        await client.query("COMMIT");
        await redis.del("tbg:snapshot");
    } catch (err) {
        await client.query("ROLLBACK");
        logger.error(`issue ${ NODE_INCENTIVE_POOL } pool bonus error, the error stock is %O`, err);
        throw err;
    } finally {
        await client.release();
    }
}


/**
 * 
 * @param {{ total: number, accInfo: { account_name: string, invite_account_week: number }[] }} val 
 * @param { Decimal } bonus 
 * @param { any } issued
 */
async function calIncome(val, bonus, issued) {
    try {
        const total = val.total;
        for (const info of val.accInfo) {
            const distrEnable = bonus.mul(info.invite_account_week).div(total);
            issued = distrEnable.add(issued);
            let remark = `account ${ info.account_name }, income ${ distrEnable.toFixed(8) }`;
            let now = new Date();
            let data = {
                "account_name": info.account_name,
                "change_amount": distrEnable,
                "create_time": df.format(now, "YYYY-MM-DD HH:mm:ssZ"),
                "op_type": OPT_CONSTANTS.BINGO,
                "extra": { "symbol": UE_TOKEN_SYMBOL },
                "remark": remark
            }
            await storeIncome(info.account_name, OPT_CONSTANTS.BINGO, data);
        }

        return issued;        
    } catch (err) {
        throw err;
    }
}