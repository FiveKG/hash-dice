// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/bind_referrer.js": "bind referrer" });
const { get_status, inspect_req_data, redis } = require("../../common/index.js");
const { updateReferCount, insertAccount, getAccountNameByReferCode, randomGetAccount } = require("../../models/account");
const { insertBalance } = require("../../models/balance");
const { insertReferrer } = require("../../models/referrer");
const { insertAccountOp } = require("../../models/accountOp")

// 绑定邀请人
async function bindReferrer(req, res, next) {
    const reqData = await inspect_req_data(req);
    logger.debug(`the param of bind referrer is: %j`, reqData);
    const accountName = reqData.account_name;
    const inviteCode = reqData.refer_code;
    let referrerName = ``;
    let referCode = ``;
    let accountType = `general`;
    // 如果邀请码是 "000000" 或者 "W00000", 随机分配一个存在的帐号作为邀请人
    if (inviteCode === "000000" || inviteCode === "W00000") {
        const rows = await randomGetAccount(accountName);
        referrerName = !!rows ? rows.account_name : '';
        // 普通用户
        if (inviteCode === "000000") {
            referCode = await redis.spop("tbg:generalInviteCode");
        } else {
            // 全球合伙人
            accountType = "global";
            const tmp = await redis.spop("tbg:globalInviteCode");
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
        // 添加推荐人
        await insertReferrer(client, referrerName, accountName);
        // 修改推荐人推荐数量信息
        await updateReferCount(client, referrerName);
        // 记录操作日志
        await insertAccountOp(client, accountName, "bind referrer", remark)
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