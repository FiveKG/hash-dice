// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/club/get_account_club" });
const { club: clubBiz } = require("@fjhb/db-op");
const { get_status } = require("../../common");

async function get_account_club(req, res, next) {
    try {
        let account_name = req.account_name;

        // 获取此用户 加入的 俱乐部的信息.
        let club_list = await clubBiz.get_club_info_by_account(account_name);

        res.send(get_status(1, club_list));
    } catch (error) {
        logger.error(error, "find club failed");
        next(error);
    }
};

module.exports = get_account_club;