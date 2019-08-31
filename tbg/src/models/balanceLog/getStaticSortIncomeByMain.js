// @ts-check
const { pool } = require("../../db/index.js");
const logger = require("../../common/logger");
const INCOME_CONSTANT = require("../../common/constant/incomeConstant.js");
const { SORT } = require("../../common/constant/optConstants");

/**
 * 根据主帐户获取用户的一行公排分红收入记录
 * @param { String[] } accountName
 * @returns { Promise<any> }
 */
async function getStaticSortIncomeByMain(accountName) {
    try {
        let selectSql = `
            WITH res AS(
                SELECT op_type, account_name, sum(current_balance) as amount 
                    FROM balance_log
                    WHERE account_name = any($1)
                    AND op_type = '${ SORT }'
                    GROUP BY op_type, account_name
            )
            SELECT * FROM res WHERE amount <= $2;
        `
        const { rows: [ result ] }  = await pool.query(selectSql, [ accountName, INCOME_CONSTANT.SORT_OUT_LINE ]);
        return  result;
    } catch (err) {
        logger.debug("根据主帐户获取用户的一行公排分红收入记录出错, error stock is %O", err);
        throw err;
    }
}

module.exports = getStaticSortIncomeByMain;