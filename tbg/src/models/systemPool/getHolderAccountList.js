// @ts-check
const { pool } = require("../../db/index.js");

/**
 * 查找符合股东分红条件的帐号
 * @return  { Promise<DB.TbgBalance[]> }
 */
async function getHolderAccount() {
    try {
        let sql = `
            SELECT * FROM tbg_balance WHERE sell_amount > 0;
        `
        let { rows } = await pool.query(sql);
        return rows;
    } catch (err) {
        throw err;
    }
}

module.exports = getHolderAccount;

/**
 * @description 查找符合股东分红条件的帐号
 * @typedef { Object } holderAccountList
 * @property { String } referrer_name
 * @property { number } total
 * @property { number } all
 */