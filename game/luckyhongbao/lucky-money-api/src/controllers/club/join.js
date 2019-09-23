// @ts-check
const logger = require("@fjhb/logger");
const { club, club_account } = require("@fjhb/db-op");
const { get_status } = require("../../common");

module.exports = async function (req, res, next) {
    try {
        const req_data = req.body;
        const accountName = req.account_name;
        logger.debug(`req_data: ${JSON.stringify(req_data)}, account_name: ${accountName}`);

        const clubId = req_data.club_id;

        if (clubId !== 1 && !/^[1-9][0-9]{5}$/.test(clubId.toString())) {
            logger.info(`参数不合法, club_id: ${clubId}, ip: ${req.ip}`);
            return res.send(get_status("参数不合法"));
        }

        const clubInfo = await club.get_by_club_id(clubId);
        if (clubInfo == null) {
            logger.info(`找不到俱乐部, club_id: ${clubId}. account_name: ${accountName}, ip: ${req.ip}`);

            return res.send(get_status("找不到俱乐部"));
        }

        const clubAccountInfo = await club_account.get_club_account(accountName, clubId);
        if (clubAccountInfo == null) {
            logger.info(`用户 ${accountName} 未加入过俱乐部 ${clubId}, 进行加入俱乐部操作`);

            await club_account.create({ "club_id": clubId, "account_name": accountName });
        }

        res.send(get_status(1, true));
    } catch (error) {
        logger.error(error, "find club failed");
        next(error);
    }
};