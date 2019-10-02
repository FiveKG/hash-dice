// @ts-check
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
const { format } = require("date-fns");
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
        const tableDate = format(new Date(), "YYYY-MM-DD");
        const tableName = `${tableDate}-snapshot`;
        const selectSnapshotExistsSql = `SELECT count(1)::INTEGER FROM pg_class WHERE relname = $1`;
        const { rows: [ { count } ] } = await pool.query(selectSnapshotExistsSql, [ tableName ]);
        // 先查有没有快照表，有的话直接使用快照
        // 否则先递归出所有的层级关系，生成一个快照表，表明可以为 YYYY-MM-DD-snapshot
        if (count !== 0) {
            const selectSnapshotSql = `SELECT * FROM ${ tableName }`;
            const { rows: snapshotList } = await pool.query(selectSnapshotSql);

        } else {
            const selectNodeAccount = `
                WITH etc AS (
                    WITH recursive all_level AS (
                        SELECT referrer_name, account_name, array[referrer_name] AS account, 1 AS depth FROM referrer 
                        WHERE referrer_name = '' AND account_name !~ '-'
                        UNION
                        SELECT r.referrer_name, r.account_name, l.account || l.account_name, l.depth + 1 AS depth 
                        FROM referrer r INNER JOIN all_level l ON r.referrer_name = l.account_name
                    )
                    SELECT referrer_name, account_name, array_append(account, account_name) AS user_level, depth FROM all_level
                )
                SELECT user_level, account_name, depth FROM etc
            `
            const { rows: nodeAccList } = await pool.query(selectNodeAccount);

            const createTableSql = `
                CREATE TABLE IF NOT EXISTS ${ tableName } (
                    id serial PRIMARY KEY UNIQUE NOT NULL DEFAULT '',
                    account_name TEXT UNIQUE NOT NULL DEFAULT '',
                    invite_account_week INTEGER NOT NULL DEFAULT 0;
                    account_level INTEGER NOT NULL DEFAULT 0;
                    create_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
                )
            `
            sqlList.push({ sql: createTableSql, values: [] });

            // 生成一个快照
            const accMap = new Map();
            for (const info of nodeAccList) {
                const accData = {
                    invite_account_week: 0,
                    account_level: 0
                }
                accMap.set(info.account_name, accData);
                for (const user_level of info.user_level) {
                    if (user_level === "") {
                        continue;
                    } else {
                        const accInfo = accMap.get(info.account_name);
                        if (!accInfo) {
                            
                        }
                    }
                }
            }

        }
    } catch (err) {
        logger.error(`issue ${ NODE_INCENTIVE_POOL } pool bonus error, the error stock is %O`, err);
        throw err;
    }
}

/**
 * 快照
 */
class Snapshot {
    /**
     * 
     * @param { string } account_name 
     * @param { number } invite_account_week 
     * @param { number } account_level 
     * @param { Date } create_time 
     * @param { string[] } account_list 
     */
    constructor(account_name, invite_account_week, account_level, create_time, account_list) {
        this.account_name = account_name;
        this.invite_account_week = invite_account_week;
        this.account_level = account_level;
        this.create_time = create_time;
        this.account_list = account_list;
    }

    /**
     * 
     * @param { string } acc 
     */
    addAccList(acc) {
        this.account_list.push(acc);
    }
}