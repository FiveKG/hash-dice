// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/account/myclub" });
const clubBiz = require("@fjhb/db-op").club;
const { get_status } = require("../../common");

async function my_club(req, res, next) {
    try {
        const accountName = req.account_name;
        logger.debug(`获取用户 ${accountName} 的俱乐部`);

        let clubInfo = await clubBiz.get_by_creator(accountName);
        if (clubInfo == null) {
            logger.info(`用户:${accountName}没有俱乐部.`);

            res.send(get_status("找不到俱乐部"));
            return;
        }

        let res_data = {
            "club_id": clubInfo.club_id,
        }

        res.send(get_status(1, res_data));
    } catch (error) {
        logger.error(error, "获取用户的俱乐部 错误.");
        next(error);
    }
};

module.exports = my_club;