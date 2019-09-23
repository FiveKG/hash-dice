//@ts-check

async function init() {
    require("./src/initEnv.js")();
    const { startNewGame } = require("@fjhb/mq-pub-sub");
    var dbOp = require("@fjhb/db-op");

    //先拿出所有正在进行中的游戏 . 已经参与的用户, 转账金额, 退回到余额.写一条退回的账户余额日志.
    let sql = `select 
    room_id , max(game_id) as game_id 
from 
    red_envelope_game 

group by room_id `;
    //当前每个房间正在进行中的游戏.
    var room_runing_game = await dbOp.db.sequelize.query(sql , {"raw": true , "type": "SELECT" });
    for (let idx = 0; idx < room_runing_game.length; idx++) {
        const room_game = room_runing_game[idx];
        console.log(`room:${room_game.room_id} , game_id:${room_game.game_id}`);
        let game = await dbOp.db.red_envelope_game.findByPk(room_game.game_id);
        let gameResultList = await dbOp.red_envelope_game_result.getByGameId(room_game.game_id);
        let room = await dbOp.room.get_by_room_id(game.room_id);
        //gameResultList 里的每个人 , 退还参与此期游戏时的抵押, 更新余额 , 写账户变动日志.
        for (let j = 0; j < gameResultList.length; j++) {
            const gameResult = gameResultList[j];
            console.log(`玩家 ${gameResult.account_name} 要增加 ${gameResult.transfer_amount} . 以及写日志`);
            await dbOp.eos_account.add_balance(gameResult.account_name , gameResult.transfer_amount ,"抵押退回" , `红包房间取消`)
            
        }
        console.log(`game_id:${game.game_id} 的剩余数量要设置成 0 , `);
        await dbOp.red_envelope_game.update_left_count(game.game_id , 0);
        let msg = {
            "room_id"     : game.room_id ,
            "account_name": game.account_name ,
            "amount"      : room.amount,
            "quantity"    : room.quantity,
            "symbol"      : "UE",
            "isRoomFirstGame": false,
            "balance_type": "balance"
        };
        console.log(msg);
        await startNewGame.pub(msg);
        await delay();
        //更新当前 game 的 left_count = 0 , 发出此房间的 开始新游戏的消息
    }
    console.log('over');
}

function delay() {
    var promise = new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve();
        }, 800);
    })
    return promise;
}

( async() => {
    await init();
})()