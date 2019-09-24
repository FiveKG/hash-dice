// @ts-check
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "snatch_red_envelope" });
const {
    red_envelope_game       : redEnvelopeGameBiz,
    red_envelope_game_result: redEnvelopeGameResultBiz,
    eos_account             : eosAccountBiz,
    room                    : roomBiz
} = require("@fjhb/db-op");

const { get_status, get_config } = require("../../common");
const { grabRedEnvelope } = require("@fjhb/mq-pub-sub");
const format = require("date-fns/format");
const url = require("url");
const xhr = require("../../common/xhr")
const symbol = get_config("symbol");
const { Decimal } = require("decimal.js");

/**
 * 用户尝试抢红包
 * 如果余额够,转发给 listenService 端,扣除余额
 * 否则返回前端再尝试 scatter 转帐
 * 
 */
async function snatch_red_envelope(req, res, next) {
    try {
        const req_data = req.body;
        logger.debug(`snatch red envelope request data: ${JSON.stringify(req_data)}`);

        // 检查请求参数
        const account_name = req_data.account_name;
        const room_id = Number(req_data.room_id);
        if (isNaN(room_id)) {
            logger.info(`该用户抢红包时, 参数不合法. account_name: ${account_name}, room_id: ${room_id}, ip: ${req.ip}`);
            return res.send(get_status("参数不合法"));
        }

        // 获取账号信息, 房间信息, 最新红包信息
        const [ 
            last_game, 
            room_info
        ] = await Promise.all([
            redEnvelopeGameBiz.get_room_last_game(room_id),
            roomBiz.get_by_room_id(room_id)
        ]);

        if (last_game == null) {  // 检查红包是否存在
            logger.warn(`根据房间ID找出最新红包, 红包不存在. account_name: ${account_name}, room_id: ${room_id}, ip: ${req.ip}`);
            return res.send(get_status(2013, "not find this red envelope"));
        } else if (room_info == null) { // 检查房间是否存在
            logger.warn(`根据房间ID找出房间, 房间不存在. account_name: ${account_name}, room_id: ${room_id}, ip: ${req.ip}`);
            return res.send(get_status(2013, "not find this red envelope"));
        }

        //获取 用户的余额 , 指定的红包游戏 , 以及 用户在此游戏里的结果
        const game_result_list = await redEnvelopeGameResultBiz.find_account_result(last_game.game_id, account_name);

        // 检查该用户是否已经抢过该红包
        if (game_result_list.length > 0) {
            logger.warn(`game_result.length:${game_result_list.length}. 已经抢过了此红包游戏. game_id:${last_game.game_id} ,account_name:${account_name}`);
            return res.send(get_status(2017, "already snatched"));
        }

        // 检查是否还有剩余红包
        if (last_game.left_count == 0) {
            logger.warn(`red_envelope.left_count:${last_game.left_count}. 红包已经抢完了. `);
            return res.send(get_status(2015, "game over"));
        }

        const room_amount = Number(room_info.amount);

        const TBG_SERVER = process.env.TBG_SERVER || "http://localhost:9527/";
        const opts = { data: { account_name: account_name } };
        logger.debug("opts: ", opts);
        // 获取用户彩码，游戏码，余额
        const { data: [ resp ] } = await xhr.get(url.resolve(TBG_SERVER, "/balance/game_balance"), opts);
        logger.debug("resp: ", resp);
        if (!resp.withdraw_enable) {
            return res.send(get_status(2014, "can not find this eos account"));
        }
        // 游戏码
        const gameCurrency = new Decimal(resp.game_currency);
        // 可提现余额
        const withdrawEnable = new Decimal(resp.withdraw_enable);
        let psData = null;
        logger.debug("symbol: ", symbol);
        // 如果游戏码额度低于红包额度
        if (gameCurrency.lessThan(room_amount)) {
            // 如果可提现余额低于红包额度
            if (withdrawEnable.lessThan(room_amount)) {
                return res.send(get_status(2012, "insufficient balance"));
            } else {
                // 使用余额投注
                psData = {
                    "accountName"   : account_name,
                    "roomId"        : room_info.room_id,
                    "symbol"        : symbol.EOS,
                    "transferAmount": room_amount,
                    "createTime"    : format(new Date()),
                    "balance_type"  : "withdraw_enable"
                }
            }
        } else {
            // 使用彩码投注
            psData = {
                "accountName"   : account_name,
                "roomId"        : room_info.room_id,
                "symbol"        : symbol.EOS,
                "transferAmount": room_amount,
                "createTime"    : format(new Date()),
                "balance_type"  : "game_currency"
            }
        }

        //满足条件 发送 用余额 抢红包的 消息, 给队列监听服务.
        await grabRedEnvelope.pub(psData);
        logger.debug(`发布 抢红包的消息 成功.`);

        res.send(get_status(1, true));
    } catch (error) {
        logger.error(error, "snatch failed");
        next(error);
    }
};

module.exports = snatch_red_envelope;