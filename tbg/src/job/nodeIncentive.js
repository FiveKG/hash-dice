// @ts-check
const { pool, psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "节点激励池派奖" });
const { Decimal } = require("decimal.js");
const { getOneAccount } = require("../models/systemPool");
const OPT_CONSTANTS = require("../common/constant/optConstants.js");
const TBG_ALLOCATE = require("../common/constant/tbgAllocateRate");
const ACCOUNT_CONSTANT = require("../common/constant/accountConstant.js");
const { getUserReferrer } = require("../models/referrer");
const INCOME_CONSTANT = require("../common/constant/incomeConstant");
const { NODE_INCENTIVE_POOL } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { updateTbgBalance, getTbgBalanceInfo } = require("../models/tbgBalance");
const { getAllParentLevel, getGlobalAccount } = require("../models/account");
const df = require("date-fns");
const { scheduleJob } = require("node-schedule");

logger.debug(`nodeIncentive running...`);
// 截止周一00:00
scheduleJob("0 0 0 * * 1", nodeIncentive);

/**
 * 节点激励池的30%作为每周奖金发放总额
 * 相应等级的用户在相应等级的奖金池获取奖金
 * 奖励依据为伞下新增用户计算获得奖金比例
 */
async function nodeIncentive() {
    try {
        const sqlList = [];
        // 获取到节点激励池的奖池额度
        const nodeIncentivePool = await getOneAccount(NODE_INCENTIVE_POOL);
        const nodeIncentivePoolAmount = new Decimal(nodeIncentivePool.pool_amount);
        // 本次分配的金额
        let distrEnable = nodeIncentivePoolAmount.mul(INCOME_CONSTANT.NODE_INCENTIVE_RATE / INCOME_CONSTANT.BASE_RATE);
        // 用户等级可得的比例
        const v1 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V1);
        const v2 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V2);
        const v3 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V3);
        const v4 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V4);
        const v5 = distrEnable.mul(INCOME_CONSTANT.NODE_INCENTIVE_V5);
        const selectSnapshotSql = `SELECT * FROM snapshot`;
        const { rows: snapshotList } = await pool.query(selectSnapshotSql);

        const accMap = new Map();
        for (const accInfo of snapshotList) {
            // 如果没有达标
            if (accInfo.standard_v < 3) {
                continue;
            }
            const userMember = 'v1';
        }
    } catch (err) {
        logger.error(`issue ${ NODE_INCENTIVE_POOL } pool bonus error, the error stock is %O`, err);
        throw err;
    }
}