// @ts-check
const logger = require("@fjhb/logger").child({ "@": "lucky_money_service/room/check_snatched" });
const {
    red_envelope_game_result: redEnvelopeGameResultBiz,
    red_envelope_game       : redEnvelopeGameBiz,
    eos_account             : eosAccountBiz
} = require("@fjhb/db-op");
const { get_status } = require("../../common");

/**
 * 检查用户是否已抢过该红包
 * 抢过返回抢红包结果
 * 否则返回 1,继续尝试抢红包或 scatter 转账抢红包
 */
async function check_snatched(req, res, next) {
    try {
        const req_data = req.query;
        logger.debug(`check_snatched . request data: ${JSON.stringify(req_data)}`);

        // 检查请求参数
        const account_name = req.account_name;
        const room_id = Number(req_data.room_id);
        if (isNaN(room_id)) {
            logger.info(`该用户抢红包时, 参数不合法. account_name: ${account_name}, room_id: ${room_id}, ip: ${req.ip}`);
            return res.send(get_status("参数不合法"));
        }

        const [ last_game ] = await Promise.all([ redEnvelopeGameBiz.get_room_last_game(room_id) ]);

        if (last_game == null) {
            logger.warn(`根据房间ID找出最新红包, 红包不存在. account_name: ${account_name}, room_id: ${room_id}, ip: ${req.ip}`);
            return res.send(get_status(2013, "找不到红包"));
        }

        const [ account_game_result, grabbedList ] = await Promise.all([
            redEnvelopeGameResultBiz.find_account_result(last_game.game_id, account_name),
            redEnvelopeGameResultBiz.getGrabbedByGameId(last_game.game_id)
        ])

        // 检查该用户是否已经抢过该红包
        if (account_game_result.length > 0) {
            logger.debug(`用户:${req.account_name} 已经抢过game_id:${last_game.game_id}.返回之前 抢的结果`);
            let user_grabbed_info = account_game_result[0];
            user_grabbed_info['grabbed_list'] = grabbedList;

            res.send(get_status(2017, user_grabbed_info));
        } else {
            logger.debug(`用户:${req.account_name} 没有抢过 game_id:${last_game.game_id}.返回成功.`);
            res.send(get_status(1, { grabbed_list: grabbedList }));
        }
    } catch (error) {
        logger.error(error, "check_snatched error");
        next(error);
    }
};

module.exports = check_snatched;