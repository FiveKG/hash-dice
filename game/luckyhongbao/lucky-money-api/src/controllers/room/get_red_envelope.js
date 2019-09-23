// @ts-check
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "get_red_envelope" });
const { red_envelope_game: redEnvelopeGameBiz, red_envelope_game_result: redEnvelopeGameResultBiz, room: roomBiz } = require("@fjhb/db-op");
const { get_status } = require("../../common");
const lodash = require('lodash');

module.exports = async function (req, res, next) {
    try {
        const req_data = req.query;
        logger.debug(`get information of the red packet room. request data: ${JSON.stringify(req_data)}, account_name: ${req.account_name}`);

        // 检查请求参数
        const room_id = Number(req_data.room_id) >> 0;
        if (room_id <= 0) {
            logger.info(`参数不合法, room_id: ${req_data.room_id} . account_name: ${req.account_name}, ip: ${req.ip}`);

            return res.send(get_status("参数不合法"));
        }
        let limit = Number(req_data.limit) >> 0;
        if (limit <= 0) limit = 10;

        //先获取房间的信息
        const room_info = await roomBiz.get_by_room_id(room_id);
        logger.debug("room_info: ", room_info);
        if (room_info == null) {
            logger.info(`房间不存在, room_id: ${room_id} . account_name: ${req.account_name}, ip: ${req.ip}`);

            return res.send(get_status(2008, "con't find room infomation"));
        }

        //获取 房间里的红包 
        const {
            rows: list,
            count: total
        } = await redEnvelopeGameBiz.getLatestListByRoomId(room_id, { limit });

        logger.debug("list: ", list);
        logger.debug("total: ", total);
        const room_red_envelop_list = lodash.orderBy(list, ["create_time"], ["asc"]);
        const gameIds = room_red_envelop_list.map(t => { return t.game_id });
        const room_red_envelope_result_list = await redEnvelopeGameResultBiz.get_game_result_list_by_game_id(gameIds);

        logger.debug("room_red_envelop_list: ", room_red_envelop_list);
        logger.debug("gameIds: ", gameIds);
        logger.debug("room_red_envelope_result_list: ", room_red_envelope_result_list);
        const res_list = room_red_envelop_list.map(t => {
            const currentGameResult = room_red_envelope_result_list.filter(r => { return r.game_id == t.game_id }); // [{}, {}, {}, {}, {}]
            const maxGameResultInfo = lodash.maxBy(currentGameResult, t => { return Number(t.amount) });

            return {
                "endTime"         : currentGameResult.length == 0 ? new Date() : currentGameResult[currentGameResult.length - 1].create_time,
                "gameChainBlockId": "",
                "game_id"         : t.game_id,
                "account_name"    : t.account_name,
                "nextSender"      : maxGameResultInfo == null ? "" : maxGameResultInfo.account_name,
                "results"         : currentGameResult.map(t  => { return { "amount": t.amount, "account_name": t.account_name } }),
                "room_id"         : room_info.room_id,
                "total_count"     : room_info.quantity,
                "left_count"      : t.left_count,
                "startTime"       : t.create_time
            };
        });

        let responseData = get_status(1);
        responseData["page_info"] = { page: 1, limit, total };
        responseData["data"] = res_list;

        res.send(responseData);
    } catch (error) {
        logger.error(error, "find red packet room failed");
        next(error);
    }
};
