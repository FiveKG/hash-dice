//@ts-check
// require("../initEnv.js")();
const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "listenChainTransferAction" });
const redis = require("@fjhb/lm-redis");
const sysConfig = require("../common/sysConfig.js");
const chainOperate = require("../common/chainOperate.js");
const { grabRedEnvelope, user_recharge } = require("@fjhb/mq-pub-sub");
// const gameManager  = require("../common/gameManager.js");
const { Decimal } = require("decimal.js");
const { addHours, format } = require("date-fns");
const gameResultLastPosKey = `lm:chain:last_pos`;

/**
 * 监听链上 对某个用户的 转账事件
 * 如果发现了某个链的操作， 那么 将发出事件消息，
 */
async function listenChainTransferAction() {
    logger.debug(`listenChainTransferAction. ${format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`);

    //获取最后一个位置，
    let lastPos = await getLastPos();
    //获取收款账户信息
    let collectionAccount = await sysConfig.collectionAccount.get();

    //获取 收款账户的 最新的10条转账信息.
    let actions = await chainOperate.getAccountAction(collectionAccount.accountName, lastPos);
    for (const action of actions) {
        var parseResult = await parseTransferAction(action);
        //检查当前 action 是否已经处理过.
        var action_flag_key = `lm:chain:trx:${parseResult.trx_id}`;
        var action_flag = await redis.get(action_flag_key);
        if (action_flag != null || parseResult.action_type !== "grab_red_envelop") {
            //处理完之后， 要把当前块设置缓存
            await setLastPos(parseResult.account_action_seq);
            // continue;  //当前块已经处理过了。
        } else {
            //未处理， 才继续进行下面的操作.
            logger.debug(`parseResult:`, parseResult);
            //当前是抢红包
            /**  
             发布用户抢红包事件，在该事件处理函数里，
                1.调用抢红包合约。
                2. 发出一个 用户抢红包的事件，web 接口将监听此事件，把事件再通过websocket转发给前端。
            */

            await grabRedEnvelope.pub({
                "accountName": parseResult.from,
                "roomId": Number(parseResult.room_id),
                "trx_id": parseResult.trx_id,
                "symbol": parseResult.symbol,
                "transferAmount": parseResult.amount,
                "createTime": parseResult.block_time,
                "balance_type": "transfer"
            });

            //处理完之后， 要把当前块设置缓存
            await setLastPos(parseResult.account_action_seq);   //每解析了一个 action ， 就设置一次 lastPos
            //var seq_key = `lm:transfer:${parseResult.account_action_seq}`;
            await redis.set(action_flag_key, JSON.stringify(parseResult), "EX", 2 * 24 * 60 * 60);
        }
    }
}

/**
 * 解析转账消息
 *
 * @param {object} action
 * @returns {Promise<TransferData>}
 */
async function parseTransferAction(action) {
    var result = {
        "global_action_seq": 0,
        "account_action_seq": -1,
        "trx_id": "",
        "action_type": "none",
        "amount": 0,//amountString,
        "symbol": "",//symbol,
        "from": "", //actData.from,
        "room_id": "", //room_id,
        "block_time": ""  //action.block_time,
    };

    if (action == null) {
        logger.debug(`parseAction , action == null`);
        return result;
    }
    // logger.debug(`${JSON.stringify(action.action_trace)}`);
    result.account_action_seq = action.account_action_seq;
    result.global_action_seq = action.global_action_seq;
    result.trx_id = action.action_trace.trx_id;

    if (action.action_trace == null) {
        logger.debug(`parseAction , action == null`);
        return result;
    }

    if (action.action_trace.act == null) {
        logger.debug(`parseAction , action.action_trace.act == null`);
        return result;
    }
    var actName = action.action_trace.act.name;
    if (actName != "transfer") {
        //logger.debug(`current action is not transfer. act.name:${actName}.${result.account_action_seq}` );
        return result;
    }

    var tokenAccount = action.action_trace.act.account ;
    if(tokenAccount != "uetokencoin"){
        //非 eosio.token 。 洗币， 
        logger.warn(`洗币:`,action.action_trace.act);
        return result;
    }

    var actData = action.action_trace.act.data;
    if (actData == null) {
        logger.debug(`parseAction , action.action_trace.act.data == null`);
        return result;
    }

    try {
        let { from, quantity, memo } = action.action_trace.act.data;
        if (!quantity) {
            logger.debug(`parseAction , actData["quantity"] == null`);
            return result;
        }
        const [amountString, symbol] = quantity.split(" ");

        result.from = from;
        result.amount = new Decimal(amountString).toNumber();
        result.symbol = symbol;
        result.block_time = format(addHours(action.block_time, 8)); //区块时间, 是 UTC时间 ,改成本地时间
        if (!isNaN(parseInt(memo))) {
            //数字， 那么是 grab_red_envelop
            result.action_type = "grab_red_envelop";
            result.room_id = memo;
            return result;
        }
        else {
            //不支持的 格式.(act type 是 transfer , 但 data的格式不对)
            return result;
        }
    } catch (error) {
        logger.error(`parseAction error.`, error.stack, error.message, JSON.stringify(action));
        return result;
    }
}

/**
 * @typedef TransferData
 * @property {number} [amount]
 * @property {string} [symbol]
 * @property {string} [from]
 * @property {string} [room_id]
 * @property {string} [block_time]
 * @property {number} account_action_seq
 * @property {number} global_action_seq
 * @property {string} trx_id
 * @property { string } [action_type] action 的类型。 memo == from ,是 recharge 。 如果是 数字， 那么是 grab_red_envelop 。 否则，none
 */




/**
 * 获取 收款账户 action 的最新的位置.
 *
 * @returns {Promise<number>}
 */
async function getLastPos() {
    try {
        return Number(await redis.get(gameResultLastPosKey)) >> 0;
    } catch (err) {
        throw err;
    }
}

/**
 * 设置 收款账户 action 的最新的位置.
 * @param {number} number
 */
async function setLastPos(number) {
    try {
        return await redis.set(gameResultLastPosKey, Number(number) >> 0);
    } catch (err) {
        throw err;
    }
}

module.exports = listenChainTransferAction;