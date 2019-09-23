//@ts-check
// require('../initEnv.js')();
const logger = require('@fjhb/logger').child({'@': 'autoGrab'});
const dbOp = require('@fjhb/db-op');
const sysConfig = require('../common/sysConfig.js');
const { differenceInSeconds  , format} = require('date-fns');
const { grabRedEnvelope } = require('@fjhb/mq-pub-sub');

/**
 * 自动抢红包的逻辑
 * 每10秒, 执行一次, 
 * 首先 从配置里拿出 冷场的红包的最长时间.然后 从数据库里查询出 每个房间最新的 红包游戏里, 超过了 冷场的时间就自动抢完剩下的红包 
 */
async function autoGrab() {
    const autoGrabIntervalTime = await sysConfig.autoGrabIntervalTime.get();
    logger.debug(`当前时间:${format(new Date(),'YYYY-MM-DD HH:mm:ss')}. autoGrabIntervalTime:${autoGrabIntervalTime}`);
    let sql = `
    select 
        result.game_id ,   max(result.create_time) as last_result_time
    from  
        red_envelope_game_result result 
    join 
        (
            select 
                room_id , max(game_id) as game_id 
            from 
                red_envelope_game 
            where 
                left_count > 0 and room_id < 200 
            group by room_id 
        )
        as room_last_game 
    on 
        result.game_id = room_last_game.game_id
    group by result.game_id `;
    //拿出官方房间里最新的游戏, 然后拿出这些的游戏的最后一条游戏结果信息,
    let game_to_grab = await dbOp.db.sequelize.query(sql , { type: "SELECT" , raw: true });

    for (let idx = 0; idx < game_to_grab.length; idx++) {
        //遍历这个集合, 检查 某个游戏最后的时间离当前时间的间隔.
        const item = game_to_grab[idx];
        logger.debug(`game_id:${item.game_id} , last_result_time: ${format(item.last_result_time , 'YYYY-MM-DD HH:mm:ss')}`);
        var span = differenceInSeconds(new Date() , item.last_result_time  );
        if(span > autoGrabIntervalTime){
            logger.debug(`游戏:${item.game_id} 的最后一次抢的时间:${format(item.last_result_time, 'YYYY-MM-DD HH:mm:ss')}.要自动抢完这个游戏了. `);
            await autoGrabGame(item.game_id);
        }
    }

}

/**
 * 自动抢一期游戏的红包
 * @param {number} game_id 游戏id
 */
async function autoGrabGame(game_id){
    //从 账号列表里 拿出 准备好的 账号,用于发布抢红包的消息.
    //先拿出这个游戏,看看还有几个红包需要抢,然后从准备好的账号里拿出这些账号.

    let game = await dbOp.red_envelope_game.get_by_gameid(game_id);
    
    let room = await dbOp.room.get_by_room_id(game.room_id);
    logger.debug(`game_id:${game.game_id}. room_id:${game.room_id} , left:${game.left_count} , total_count:${game.total_count}`);
    if(game == null){
        logger.error(`未获取到 游戏. game_id:${game_id}`);
        return;
    }
    if(room == null){
        logger.error(`未获取到 房间. game_id:${game_id} ,game.room_id:${game.room_id}`);
        return;
    }

    let accounts = await sysConfig.autoGrabAccounts.get() || [] ;
    if(accounts.length == 0){
        logger.error(`未获取到 自动抢红包账户.`);
        return;
    }

    let selectedAccount = getRandomArrayElements(accounts , game.left_count);
    
    if(selectedAccount.length != game.left_count){
        logger.error(`selectedAccount.length != game.left_count . ${selectedAccount.length} , ${game.left_count}`);
        //但是还可以继续.
    }else{
        logger.debug(`选出了:${selectedAccount.join(',')} 这几个用户 自动抢 ${room.room_id} 的红包。`);
    }

    for (let idx = 0; idx < selectedAccount.length; idx++) {
        const account_name = selectedAccount[idx];
        logger.debug(`当前第${idx+1}次抢${room.room_id} 最新的红包。 由 ${account_name} 抢。`);
        let msg = {
            'accountName'   : account_name ,
            'balance_type'  : 'balance',
            'createTime'    : format(new Date(), 'YYYY-MM-DD HH:mm:ss'),
            'roomId'        : room.room_id,
            'symbol'        : 'UE' ,
            'transferAmount': room.amount,
            'trx_id'        : ''
        };
        await grabRedEnvelope.pub(msg);
        logger.debug(`自动抢红包的消息发送完成.${JSON.stringify(msg)}`);
        let random = randomNum(1000 , 5000);
        await delay(random);//随机延迟 1秒 到 5秒.
    }
}


function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            //@ts-ignore
            return parseInt(Math.random() * minNum + 1, 10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

/**
 *  延迟指定的描述
 * @param {number} ms 秒数
 * @returns {Promise<void>}
 */
function delay(ms) {
    var promise = new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
    return promise;
}

/**
 * 从数组里随机拿出指定数量的元素
 * @param {object[]} arr 
 * @param {number} count 
 */
function getRandomArrayElements(arr, count) {
    //todo: 需要检查拿出的数量不能大于 给定的数组的长度.
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

/**
 * 先初始化好准备好的账号
 */
async function initAutoGrabAccounts() {
    //从配置里拿出准备好的账号,检查账号表里是否存在, 不存在就插入账号.
    const autoGrabAccounts = await sysConfig.autoGrabAccounts.get();

    /**
     * 
    '1111wwww1234','qazxsw223355','gdgdgdgdgd33','kongkong3333','wntwjy11svqf',
    '53wgnwynwsfx','qweasd123124','agbwtbecjqw3','wsxzaq332211','edcxsw112233',
    'cxzdsa432121','25412rtyfd12','wersa32541qw','21435wrsae52','23145edggf41',
    '23415sfsfa12','25412qwert32','14352asdfg55','zhangzhang22','dsacxz551133',
    'xiaoxiao1133','wangwang1224','dongdong3344','xiaoming1451','qazwsx113355',
    'edcqaz443355','ppooiiuu1245','qqwweerrtt34','12gghhjjkkll','esoesoeso335',
    'yyuuiioo2145','354asdfghjkl','eoseoseos554','zxcvbnm53214','zhangzhang45',
    'vivooppo2255','rfvcde434322','qazrfv551144','yytt22334455','qqww11223344'
     */

    if(autoGrabAccounts == null){
        logger.error(`配置里没有 自动抢红包的账户.请检查`);
        process.exit();
    }

    if(autoGrabAccounts.length == 0){
        logger.error(`配置里 自动抢红包的账户为空数组,请检查`);
        process.exit();
    } 

    //拿出这些用户, 1. 检查是否存在,不存在就创建,   2. 检查余额够不够. 余额不够就加上1w .
    let dbAccounts = await dbOp.eos_account.get_account_balance(autoGrabAccounts);
    for (let idx = 0; idx < autoGrabAccounts.length; idx++) {
        const account_name = autoGrabAccounts[idx];
        let findAccount = dbAccounts.find( t => { return t.account_name == account_name ;} );
        if(findAccount == null){
            //要添加用户,并设置账户的余额.
            logger.debug(`初始化自动抢红包的账户${account_name}. 余额设置为 10000. `);
            await dbOp.eos_account.add_balance(account_name ,10000 , '初始化自动抢红包的账户','初始化自动抢红包的账户,余额设置为10000')
        }
        else{
            //检查余额够不够. 不够150 了, 就加余额
            if(findAccount.balance <= 150){
                logger.debug(`自动抢红包的账户${account_name}. 余额为:${findAccount.balance}. 增加 1000. `);
                await dbOp.eos_account.add_balance(account_name , 1000 , '增加自动抢红包账户的余额', `当前余额是${findAccount.balance}. 增加1000 个.`)
            }
        }
    }
}

module.exports = {
    autoGrab , initAutoGrabAccounts
};