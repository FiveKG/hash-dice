// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/bind_referrer.js": "bind referrer" });
const { get_status, inspect_req_data, redis, generate_primary_key } = require("../../common/index.js");
const { ACCOUNT_TYPE, INVITE_CODE, INVITE_CODE_KEY } = require("../../common/constant/accountConstant.js");
const { updateReferCount, insertAccount, getAccountNameByReferCode, randomGetAccount } = require("../../models/account");
const { insertBalance } = require("../../models/balance");
const { insertReferrer } = require("../../models/referrer");
const { insertAccountOp } = require("../../models/accountOp")
const { insertTbgBalance } = require("../../models/tbgBalance")

// 绑定邀请人
async function bindReferrer(req, res, next) {
    const reqData = await inspect_req_data(req);
    logger.debug(`the param of bind referrer is: %j`, reqData);
    const accountName = reqData.account_name;
    const inviteCode = reqData.refer_code;
    // 先检查用户是否绑定过
    let selectSql = `
             select r.referrer_name, r.account_name 
                from referrer r 
                join account a on a.account_name = r.account_name 
                where r.account_name = $1;
        `
    let { rows } = await pool.query(selectSql, [ accountName ]);
    logger.debug(`the account info is %j`, rows[0]);
    if (!!rows[0]) {
        return res.send(get_status(1020, "this account already bind"));
    }
    let referrerName = ``;
    let referCode = ``;
    let accountType = ACCOUNT_TYPE.GENERAL;
    // 如果邀请码是 "000000" 或者 "W00000", 随机分配一个存在的帐号作为邀请人
    if (inviteCode === INVITE_CODE.GENERAL || inviteCode === INVITE_CODE.GLOBAL) {
        // 普通用户
        if (inviteCode === INVITE_CODE.GENERAL) {
            // 开始先检查下有无全球合伙人, 没有的话普通用户不能绑定
            let sql = `
                select count(1)::INTEGER AS count from account where account_type = $1
            `
            let { rows: [{ count }] } = await pool.query(sql, [ ACCOUNT_TYPE.GLOBAL ]);
            logger.debug("count: ", count);
            if (!count) {
                referrerName = '';
                const tmp = await redis.spop(INVITE_CODE_KEY.GLOBAL);
                referCode = `W${tmp}`
                // return res.send(get_status(1021, "当前系统还没有全球合伙人，需有人成为全球合伙人后才可正常绑定"));
            } else {
                const rows = await randomGetAccount(accountName);
                referrerName = rows.account_name;
                referCode = await redis.spop(INVITE_CODE_KEY.GENERAL);
            }
        } else {
            // 全球合伙人
            // 全球合伙人的推荐人都为空，每个全球合伙人都位于最顶端，下方不能有其他全球合伙人
            accountType = ACCOUNT_TYPE.GLOBAL;
            const rows = await randomGetAccount(accountName, accountType);
            referrerName = !!rows ? rows.account_name : '';
            const tmp = await redis.spop(INVITE_CODE_KEY.GLOBAL);
            referCode = `W${tmp}`
        }
    } else {
        // 找到邀请码对应的用户
        const result = await getAccountNameByReferCode(inviteCode);
        if (!!result) {
            referrerName = result;
        } else {
            const { rows: [ { count } ] } = await pool.query("SELECT count(1) FROM account");
            if (count !== 0) {
                return res.send(get_status(1001, "this referrer does not exists"));
            }
        }
    }

    const client = await pool.connect();
    await client.query("BEGIN");
    try {
        let remark = `user ${ referrerName } invites ${ accountName }`;
        // 添加用户
        await insertAccount(client, accountName, referCode, accountType);
        // 添加用户默认资产
        await insertBalance(client, accountName);
        await insertTbgBalance(client, generate_primary_key(), accountName, 0, 0, 0, new Date());
        // 添加推荐人
        await insertReferrer(client, referrerName, accountName);
        // 修改推荐人推荐数量信息
        await updateReferCount(client, referrerName);
        // 记录操作日志
        await insertAccountOp(client, accountName, "bind", remark)
        await client.query("COMMIT");
        res.send(get_status(1));
    } catch (err) {
        logger.error("bind referrer error, the error stock is %O", err);
        await client.query("ROLLBACK");
        throw err
    } finally {
        await client.release();
    }
}

module.exports = bindReferrer;