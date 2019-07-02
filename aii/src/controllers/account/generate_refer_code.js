// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/account/generate_refer_code.js": "generate invitation code" });
const { get_status, inspect_req_data, generate_primary_key, redis } = require("../../common/index.js");
const { Decimal } = require("decimal.js");
const { getInviteCode } = require("../../models/account");

// 用户倒入钱包时, 生成邀请码，生成 TBG 资产信息
async function genReferCode(req, res, next) {
    let reqData = await inspect_req_data(req);
    logger.debug(`the request param is: ${ JSON.stringify(reqData) }`);
    logger.debug("generate invitation code...");
    let rows = await getInviteCode(reqData.account_name);
    logger.debug(`the account invite code is ${ JSON.stringify(rows) }`);
    if (rows) {
        return res.send(get_status(1012, "this user had invest code"));
    }
    
    let code =  await redis.spop("tbg:inviteCode");
    logger.debug(`code: ${ code }`);
    const client = await pool.connect();
    await client.query("BEGIN");
    try {
        let insertAccountSql = `
            insert into
            account (
                id, account_name, refer_count, member_level, refer_code, create_time
            )
            values (
                '${ generate_primary_key() }', $1, 0, 1, ${ code }, now()
            );
        `
        let values = [reqData.account_name]
        await client.query(insertAccountSql, values);
        let opSql = `
                insert into 
                account_op (account_name, op_type, remark, create_time)
                values (
                    '${ reqData.account_name }', 'import account', 'set invitation code', now()
                );
                insert into balance values (
                    '${ generate_primary_key() }', '${ reqData.account_name }', ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                    ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) },
                    ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, ${ new Decimal(0).toFixed(8) }, now()
                );
        `
       await client.query(opSql);
       await client.query("COMMIT");
       res.send(get_status(1));
    } catch (err) {
        await client.query("ROLLBACK");
        throw err
    } finally {
        await client.release();
    }
}

module.exports = genReferCode;