// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/room/create" });
const {
    room       : roomBiz,
    club       : clubBiz,
    eos_account: eosAccountBiz
} = require("@fjhb/db-op");
const { get_status, get_config } = require("../../common");
const { startNewGame } = require("@fjhb/mq-pub-sub");

const symbol = get_config("symbol");

module.exports = async function (req, res, next) {
    try {
        let req_data = req.body;

        logger.debug(`requert data: ${JSON.stringify(req_data)}`);
        // 检查请求数据
        if (typeof req_data.amount !== "number" || req_data.amount < 0.1) {
            logger.info(`创建房间时, 红包[ 金额 ]不符合系统设定的值, amount: ${req_data.amount}, account_name: ${req.account_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        } else if (typeof req_data.quantity !== "number" || req_data.quantity >> 0 < 2) {
            logger.info(`创建房间时, 红包[ 人数 ]不符合系统设定的值, quantity: ${req_data.quantity}, account_name: ${req.account_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        }

        let club_info = await clubBiz.get_by_club_id(req_data.club_id);

        if (!club_info) {
            logger.warn(`can not find club, club_id: ${req_data.club_id}`);
            return res.send(get_status(2001, "can not find club"));
        }

        let eos_account_info = await eosAccountBiz.get_by_account_name(req.account_name);

        if (!eos_account_info) {
            logger.warn(`can not find this eos account, account_name: ${req.account_name}`);
            return res.send(get_status(2014, "can not find this eos account"));
        }

        // 检查该俱乐部是否属于该用户
        if (eos_account_info.account_name !== club_info.creator_name) {
            logger.info(`该俱乐部不属于该用户, account_name: ${eos_account_info.account_name}, club_creator_name: ${club_info.creator_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        }

        const amount = Number(req_data.amount);
        if (isNaN(amount) || amount < 0) {
            logger.debug(`参数不合法, amount: ${req_data.amount}`);

            return res.send(get_status("参数不合法"));
        } else if (Number(eos_account_info.balance) < amount) {
            logger.debug(`该账号余额不足, account_name: ${eos_account_info.account_name}, req_amount: ${amount}, account_balance: ${eos_account_info.balance}`);

            return res.send(get_status(2012, "insufficient balance"));
        }

        let room_data = {
            "club_id": req_data.club_id,
            "amount": amount,
            "quantity": req_data.quantity
        };

        // 使用事务处理
        const room_id = await roomBiz.createAndUpdateClub(room_data);

        let pub_start = {
            "room_id"        : room_id,
            "account_name"   : eos_account_info.account_name,
            "amount"         : req_data.amount,
            "quantity"       : req_data.quantity,
            "isRoomFirstGame": true,
            "symbol"         : symbol.EOS,
            "balance_type"   : "balance"
        };

        await startNewGame.pub(pub_start);
        logger.debug(`发布开始新游戏成功`);

        res.send(get_status(1, room_id));
    } catch (error) {
        logger.error(error, "create room failed");
        next(error);
    }
};
