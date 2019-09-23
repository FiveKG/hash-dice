//@ts-check
// require("../initEnv.js")();
const chainOperate = require("../common/chainOperate.js");
const { notify_game_start } = require("@fjhb/mq-pub-sub");
const sysConfig = require("../common/sysConfig.js");
const { Decimal } = require("decimal.js");

const logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "startNewGame" });
const gameManager = require("../common/gameManager.js");
const dbOp = require("@fjhb/db-op");
const padStart = require("../common/padStart.js");
const randomWeights = require("../common/randomWeights");

const redis = require("@fjhb/lm-redis");
/**
 * 定义一个 0 .
 */
const zero = new Decimal(0);
/**
 *  开始新游戏
 *
 * @param {StartNewGameArgv} eventArgv
 */
async function startNewGame(eventArgv) {
    let chain_op_failure = true,
        db_op_failure = true;
    try {
        logger.debug(`startNewGame(开始新游戏) eventArgv: %j`, eventArgv);
        // 1. 开始游戏前, 先判断是否存在该 room_id 是否存在
        // 2. 如果存在, 那么需要检查 left_count 字段的值是否为 0. 如果不为 0 , 那么需要 写错误日志, 并 return
        const roomId = Number(eventArgv.room_id);
        const roomInfo = await dbOp.room.get_by_room_id(roomId);
        if (roomInfo) {
            const redEnvelopeGameInfo = await dbOp.red_envelope_game.get_room_last_game(roomId);
            if (redEnvelopeGameInfo) {
                // 判断 left_count 是否为 0
                if (Number(redEnvelopeGameInfo.left_count) > 0) {
                    logger.warn(`该房间的游戏尚未结束, 请检查逻辑是否正确. redEnvelopeGameInfo: %j`, redEnvelopeGameInfo);
                    return;
                }
            }
        }

        //设置 room表 起始id为 200. 初始官方俱乐部的房间时, 手工插入房间号 从1最多到200.
        //那么在这里判断是否系统俱乐部的房间时,只需简单的判断room_id是否小于200. 如果是, 就是系统俱乐部. 
        //根据 红包分配流程 , 计算 当前红包 的金额.
        logger.debug(`房间: ${roomId} 将要开始新一期游戏.由:${eventArgv.account_name}. ${eventArgv.quantity} 人抢 ${eventArgv.amount}`);
        let club = await dbOp.club.get_club_by_room(roomId);

        //拿出发红包的用户的账户信息。  在这个的基础上， 计算此用户的账户余额变动日志
        //其中， 发红包用户有两次余额变动: 1. 发出红包 导致的余额变动， 2. 系统由于创建房间，给创建者的返佣
        let room = await gameManager.getRoom(roomId);

        //拿出红包分配 配置里的比例，计算 红包各部分的分配数字
        let allocationNumber = await calculate_allocation_nbr(roomId, eventArgv.amount, club);
        logger.debug(`allocationNumber：${JSON.stringify(allocationNumber)}`);

        let allDbOpAry = []; //所有的数据库操作信息的数组
        //1. 判断是否需要扣除当前游戏的余额。 房间的创始红包， 就需要扣除余额
        if (eventArgv.isRoomFirstGame === false) {
            //之所以 === false ，是由于在 endGame 里，才会提供此字段且为false。api 接口部分可能未提供。提供的话，那么应该为 true
            //当前是由 结束游戏的事件处理逻辑里，发出的 开始新游戏的 事件。此时， 要按照红包的余额 分配 规则， 生成开始新游戏的数据库操作信息对象
            logger.debug(`非创始红包。 `);
        }
        else {
            logger.debug(`当前是房间 : ${roomId} 的第一个红包。由${eventArgv.account_name}发出。`);
            //todo: 先检查余额够不够。 其实， 在接口那里已经检查了， 此处暂时不检查了 。
            //房间的第一个红包。 此时， 要扣除用户的余额，
            await dbOp.eos_account.add_balance(eventArgv.account_name, zero.sub(eventArgv.amount).toNumber(), "抵押", `发出房间:${roomId} 的创始红包 , 预先扣除 ${eventArgv.amount}的余额`);
        }

        //先构造要插入到数据库的对象， 然后 开启 事务， 插入或更新这么一系列的数据 ， 然后执行链操作。
        //如果 链操作没有异常抛出， 那么事务提交。
        //如果有异常， 那么 回滚事务。
        let nextGameId = await gameManager.getNextGameId();
        logger.info(`当前要发出的游戏的GameId:${nextGameId}`);

        //针对当前游戏, 分配好随机数 , 使用 nextGameId 作为key , 把随机数量的数组放到redis 里, 
        //后面 用户来抢的时候, 就从redis 里拿出一个数字, 作为此用户抢的金额.
        let randomAmountObj = {}; 
        const room_quantity = Number(room.quantity);
        if (room_quantity > 100) {

        } else if (room_quantity >= 3) {
            randomAmountObj = GenerateRandomAmount(new Decimal(allocationNumber.redEnvelopeAmount).toNumber(), room_quantity);
        } else if (room_quantity >= 2) {
            randomAmountObj = getTwoRandomAmount(Number(allocationNumber.redEnvelopeAmount));
        } else {
            randomAmountObj['01'] = Number(allocationNumber.redEnvelopeAmount);
        }

        let game_amount_key = `game_result_amount:${nextGameId}`;
        await redis.hmset(game_amount_key, randomAmountObj);  //作为 hash 对象存储到 redis 中.
        //todo: 过期时间.
        logger.debug(`game_amount_key:${game_amount_key} ,  randomAmountObj:${JSON.stringify(randomAmountObj)}`);
        //调用链的 发红包合约
        let create_red_envelope_argv = {
            "game_id": nextGameId,
            "account_name": eventArgv.account_name,
            "amount": `${new Decimal(allocationNumber.redEnvelopeAmount).toFixed(4)} ${eventArgv.symbol}`,
            "quantity": eventArgv.quantity
        };
        logger.debug(`开始执行开始新游戏合约.`);
        await chainOperate.create_red_envelope(create_red_envelope_argv);
        chain_op_failure = false;
        logger.debug(`开始新游戏合约 执行 成功. `);

        //先 计算出 db_op_info , 再执行批量的数据库事务。 
        let db_op_object_list = await compute_start_game_db_op(nextGameId, allocationNumber, eventArgv, club);

        logger.debug(`开始执行批量数据库事务操作. nextGameId:${nextGameId}. db_op_object_list:${JSON.stringify(db_op_object_list)}`);
        let db_op_flag = await dbOp.batch_trans_db_op(db_op_object_list);
        db_op_failure = false;
        logger.debug(`批量数据库事务操作 成功. nextGameId:${nextGameId}.`);

        if (db_op_flag) {
            //事务执行成功了 ， 才发布游戏开始的事件。
            await notify_game_start.pub({
                "room_id"     : eventArgv.room_id,
                "account_name": eventArgv.account_name,
                "create_time" : new Date(),
                "game_id"     : nextGameId,
                "amount"      : eventArgv.amount.toString(),
                "quantity"    : eventArgv.quantity
            });
            logger.debug(`notify_game_start.pub 完成. `);
        }
    } catch (err) {
        logger.error(`chain_op_failure:${chain_op_failure}. db_op_failure:${db_op_failure}.`)
        if (!chain_op_failure && db_op_failure) {
            logger.error(`链操作成功 , 但数据库操作失败。 这就有麻烦了。需要重试插入`);
        }
        logger.error(err, `startNewGame failed, params: ${JSON.stringify(eventArgv)}`);
    }
}

/**
 * 生成随机金额, 只适用于数量为 2 的人数
 * @param {Number} amountTotal 红包金额
 */
function getTwoRandomAmount(amountTotal) {
    let resultAmountObj = {};
    let randomAmountList = [];

    let randomNumber = Math.random() * (10000 - 1) + 1 >> 0;  // [1, 9999] 范围
    let randomAmount = Number(Decimal.mul(amountTotal, randomNumber).div(10000).toFixed(4));
    let leftAmount = Decimal.sub(amountTotal, randomAmount).toNumber();

    while (randomAmount === leftAmount) {
        randomNumber = Math.random() * (10000 - 1) + 1 >> 0;
        randomAmount = Number(Decimal.mul(amountTotal, randomNumber).div(10000).toFixed(4));
        leftAmount = Decimal.sub(amountTotal, randomAmount).toNumber();
    }

    randomAmountList.push(randomAmount);
    randomAmountList.push(Decimal.sub(amountTotal, randomAmount).toNumber());

    for (let i = 0; i < randomAmountList.length; ++i) {
        let key = padStart((i + 1).toString(), 2, "0");

        resultAmountObj[key] = randomAmountList[i];  
    }

    return resultAmountObj;
}

/**
 * 生成随机金额, 只适用于 [3, 100] 范围的人数
 * @param {Number} amount 红包金额
 * @param {Number} count 抢红包人数
 */
function GenerateRandomAmount(amount, count) {  // 0.1 * 0.95
    const randomWeightsList = randomWeights(count);  // 获取随机万分比权重列表, [123, 2345, ...]
    let resultAmountObj = {};
    let randomAmountList = [];
    let amountTmp = Decimal.mul(amount, 10000).toNumber();  // 基础金额万分比权重, 金额 * 10000
    for (let i = 0; i < randomWeightsList.length; ++i) {
        const rate = randomWeightsList[i];

        let randomAmount = Decimal.mul(amount, rate).toNumber() >> 0;  // 向下取整
        randomAmountList.push(randomAmount);
    }

    // 由于向下取整导致, 产生差值, 将差值 附加 到 最小 权重, 且 所有 金额 唯一
    const total = randomAmountList.reduce((s, n) => Decimal.add(s, n).toNumber());
    if (total < amountTmp) {
        let differenceValue = Decimal.sub(amountTmp, total).toNumber();
        for (let i = 0; i < randomAmountList.length; ++i) {
            let newValue = randomAmountList[i] + differenceValue;
            if (randomAmountList.indexOf(newValue) === -1) {
                randomAmountList[i] = newValue;
                break;
            }
        }
    }

    // 排序打乱
    randomAmountList = randomAmountList.sort(function () {
        return .5 - Math.random();
    });

    for (let i = 0; i < randomAmountList.length; ++i) {
        let key = padStart((i + 1).toString(), 2, "0");

        resultAmountObj[key] = Decimal.div(randomAmountList[i], 10000).toFixed(4);  // 将金额权重 再 除 10000 后, 得到 真实的 金额
    }

    return resultAmountObj;
}

/**
 * 计算开始新游戏时的数据库操作 的对象
 *
 * @param {number} next_game_id
 * @param {RedEnvelopeAllocationNumber} allocationNumber
 * @param {StartNewGameArgv} eventArgv
 * @param {ClubInfo} club
 * @returns {Promise<object[]>}
 */
async function compute_start_game_db_op(next_game_id, allocationNumber, eventArgv, club) {

    //俱乐部创建者的部分
    let ownerBalanceChangeRemark = `用户:${eventArgv.account_name}在房间:${eventArgv.room_id} 发红包，数量:${eventArgv.amount}.俱乐部创建者分红:${allocationNumber.ownerBonusAmount}`;
    let clubOwnerBalanceDbOp = [];
    if (zero.lessThan(allocationNumber.ownerBonusAmount)) {
        // 大于0 ， 需要生成 数据库操作的 信息对象
        clubOwnerBalanceDbOp = await dbOp.eos_account.compute_account_balance_db_op(club.creator_name, allocationNumber.ownerBonusAmount, "创建红包房间返佣", ownerBalanceChangeRemark);
    } else {
        logger.debug(`allocationNumber.ownerBonusAmount == 0. 无需 调用 dbOp.eos_account.compute_account_balance_db_op `);
    }


    //分红池部分
    let bonusPoolAmountChangeRemark = `用户:${eventArgv.account_name}在房间:${eventArgv.room_id} 发红包，数量:${eventArgv.amount}.向分红池投入:${allocationNumber.bonusPoolAmount}`;
    let bonusPoolDbOp = [];
    if (zero.lessThan(allocationNumber.bonusPoolAmount)) {
        //
        bonusPoolDbOp = await dbOp.bonus_pool.compute_bonus_pool_db_op(allocationNumber.bonusPoolAmount, eventArgv.room_id, bonusPoolAmountChangeRemark);
    }
    else {
        logger.debug(`allocationNumber.bonusPoolAmount == 0. 无需 调用 dbOp.bonus_pool.compute_bonus_pool_db_op `);
    }

    //系统抽水的部分
    let systemBonusAmountChangeRemark = `用户:${eventArgv.account_name}在房间:${eventArgv.room_id} 发红包，数量:${eventArgv.amount}.向系统分红投入:${allocationNumber.systemBonusAmount}`;
    let systemBonusDbOp = [];
    if (zero.lessThan(allocationNumber.systemBonusAmount)) {
        systemBonusDbOp = await dbOp.system_bonus.compute_system_bonus_amount_db_op(allocationNumber.systemBonusAmount, eventArgv.room_id, systemBonusAmountChangeRemark);
    }
    else {
        logger.debug(`allocationNumber.systemBonusAmount == 0. 无需 调用 dbOp.system_bonus.compute_system_bonus_amount_db_op `);
    }

    //发红包的部分
    let game = get_game_db_op(next_game_id, eventArgv.room_id, eventArgv.quantity, eventArgv.account_name);
    //组成一个总的数组
    let ary = clubOwnerBalanceDbOp.concat(bonusPoolDbOp).concat(systemBonusDbOp);
    ary.push(game);
    return ary;
}

/**
 * @typedef DB_OP_INFO
 * @property {string} sql 
 * @property {string} type  
 * @property {object} bind
 */

/**
 * 获取 生成游戏 记录的 数据库操作.
 * @returns {DB_OP_INFO}
 */
function get_game_db_op(next_game_id, room_id, quantity, account_name) {

    return {
        "sql": "insert into red_envelope_game (game_id , room_id ,account_name , left_count , total_count , create_time) values ($game_id , $room_id ,$account_name , $left_count , $total_count , $create_time)",
        "type": dbOp.db.Sequelize.QueryTypes.INSERT,
        "bind": {
            "game_id": next_game_id,
            "room_id": room_id,
            "left_count": quantity,
            "total_count": quantity,
            "account_name": account_name,
            "create_time": new Date()
        }
    }
}


/**
* @typedef ClubInfo
* @property {number} club_id
* @property {string} club_name
* @property {string} refer_club_id 
* @property {string} creator_name 
*/


/**
 *根据 配置， 计算 红包的分配 方案数字
 *
 * @param {number} roomId
 * @param {number} red_envelope_amount
 * @param {ClubInfo} club_info
 * @returns {Promise<RedEnvelopeAllocationNumber>}
 */
async function calculate_allocation_nbr(roomId, red_envelope_amount, club_info) {
    //当前 房间 所属的俱乐部, 是否 官方俱乐部. 
    //如果是官方俱乐部, 那么,提取 4.5% 到 系统分红.   玩家创建俱乐部的房间， 没有
    //如果不是, 那么 检查俱乐部 是否有推荐关系,
    //如果有,  那么要 提取 1%  到 系统分红, 提取 3.5%到俱乐部创建玩家的余额
    //如果没有, 那么要 提取 2%  到 系统分红, 提取 2.5%到俱乐部创建玩家的余额

    //先拿出 红包的分配比例, 计算分红的 数量.
    let redEnvelopeAllocation = await sysConfig.red_packet_allocation.get();
    logger.debug(`redEnvelopeAllocation config :${JSON.stringify(redEnvelopeAllocation)}`);
    // 投入到分红池的数量,  
    let bonusPoolAmount = Decimal.div(redEnvelopeAllocation.bonusPoolRate, 100).mul(red_envelope_amount).toFixed(6);
    logger.debug(`投入到分红池的数量:`, bonusPoolAmount);
    //实际发的红包的数量  ,
    let redEnvelopeAmount = Decimal.div(redEnvelopeAllocation.redEnvelopRate, 100).mul(red_envelope_amount).toFixed(6);
    logger.debug(`实际发的红包的数量:`, redEnvelopeAmount);
    let systemBonusAmount, ownerBonusAmount;//
    //注意， 房间id 小于 200 的，一定是系统俱乐部的房间。
    if (roomId < 200) {
        //官方俱乐部。 
        systemBonusAmount = Decimal.div(redEnvelopeAllocation.reservedPart.officialClubSystem, 100).mul(red_envelope_amount).toFixed(6);
        ownerBonusAmount = "0"
        logger.debug(`官方俱乐部。 系统的部分:${systemBonusAmount} , 创建者部分:${ownerBonusAmount}`);
    }
    else {
        //玩家俱乐部 ， 检查俱乐部是否有引用其他俱乐部
        let isAgentClub = club_info.refer_club_id != "";//有引用的俱乐部id，那么就是代理的俱乐部 //await clubBiz.check_is_agent_club(roomId);
        if (isAgentClub) {//当前俱乐部的 refer_club_id 存在值。
            systemBonusAmount = Decimal.div(redEnvelopeAllocation.reservedPart.refCommonClub.systemRate, 100).mul(red_envelope_amount).toFixed(6);
            ownerBonusAmount = Decimal.div(redEnvelopeAllocation.reservedPart.refCommonClub.ownerRate, 100).mul(red_envelope_amount).toFixed(6);
            logger.debug(`非官方俱乐部。 系统的部分:${systemBonusAmount} , 创建者部分:${ownerBonusAmount}`);
        }
        else {
            systemBonusAmount = Decimal.div(redEnvelopeAllocation.reservedPart.noRefComRefClub.systemRate, 100).mul(red_envelope_amount).toFixed(6);
            ownerBonusAmount = Decimal.div(redEnvelopeAllocation.reservedPart.noRefComRefClub.ownerRate, 100).mul(red_envelope_amount).toFixed(6);
            logger.debug(`非官方俱乐部。 系统的部分:${systemBonusAmount} , 创建者部分:${ownerBonusAmount}`);
        }
    }
    return {
        "bonusPoolAmount": bonusPoolAmount,
        "redEnvelopeAmount": redEnvelopeAmount,
        "systemBonusAmount": systemBonusAmount,
        "ownerBonusAmount": ownerBonusAmount
    }
}

/**
 * @typedef RedEnvelopeAllocationNumber 红包金额的分配
 * @property {string} bonusPoolAmount  分红池的部分
 * @property {string} redEnvelopeAmount 发出红包的部分
 * @property {string} systemBonusAmount 系统的部分
 * @property {string} ownerBonusAmount 俱乐部创建者的部分
 */

module.exports = startNewGame;


/**
 * @typedef StartNewGameArgv
 * @property {number} room_id           房间id
 * @property {string} account_name      发红包的用户
 * @property {number} amount            发的金额
 * @property {number} quantity          发的数量
 * @property {string} symbol            币种符号。 默认是 EOS
 * @property {boolean} isRoomFirstGame   是否房间的第一个红包。
 * @property {string} balance_type      余额类型。 必须是 balance|transfer
 */