// @ts-check
const { pool } = require("../../db");
const logger = require("../../common/logger.js").child({ "@controllers/team/staticMode.js": "static mode" });
const { get_status, inspect_req_data } = require("../../common/index.js");
const { getStaticMode, getUserSubAccount } = require("../../models/account");

// 三三排位
async function staticMode(req, res, next) {
    try {
        let reqData = await inspect_req_data(req);
        logger.debug(`the param is: ${ JSON.stringify(reqData) }`);
        let accountName = reqData.account_name;
        // 查找当前三三静态最大的层
        let selectMaxLevel = await pool.query(`select max(level) as max_level from sub_account;`);
        // console.log("selectMaxLevel: ", selectMaxLevel);
        if (!selectMaxLevel.rows[0]) {
            // todo
            return
        }
        // 查找当前三三静态最大的层的子帐号数
        let selectMaxLevelSubAccountCount = await pool.query(`select count(1) from sub_account where level = (select max(level) from sub_account);`);
        // console.log("selectMaxLevelSubAccountCount: ", selectMaxLevelSubAccountCount);
        if (!selectMaxLevelSubAccountCount.rows[0]) {
            // todo
            return 
        }
        let maxLevelSubAccountCount = selectMaxLevelSubAccountCount.rows[0].count;
        let maxLevel = selectMaxLevel.rows[0].max_level
        let teamLevelArr = []
        for (let i = 1; i <= maxLevel; i++) {
            let count = 0;
            if (i === maxLevel) {
                count = Math.pow(3, i) - maxLevelSubAccountCount;
            }
            // 查找当前用户在三三静态每层的子帐号数
            let selectRepeatAccountCount = await pool.query(`select count(1) from sub_account where main_account = '${ accountName }' and level = ${ i }`);
            // console.log("selectRepeatAccountCount: ", selectRepeatAccountCount);
            if (!selectRepeatAccountCount.rows[0]) {
                // todo
                return;
            }
            // 查找当前用户在三三静态每层的子帐号数
            let selectInviteAccountCount = await pool.query(`
                    select 
                        distinct r.account_name 
                        from referrer r 
                        join sub_account s on s.main_account = r.account_name 
                        where r.referrer_name = '${ accountName }' and s.level = ${ i };
            `);
            // console.log("selectInviteAccountCount: ", selectInviteAccountCount);
            // if (!selectInviteAccountCount.rows) {
            //     // todo
            //     return;
            // }
            let detail = {
                "level": i,
                "has_account": Math.pow(3, i),
                "invite_account": selectInviteAccountCount.rowCount,
                "repeat_account": selectRepeatAccountCount.rows[0].count,
                "last_account": count
            }
            teamLevelArr.push(detail);
        }

        // console.log("teamLevelArr: ", teamLevelArr);
        let resData = get_status(1);
        resData["data"] = teamLevelArr;
        res.send(resData);
    } catch (err) {
        throw err
    }
}

module.exports = staticMode;