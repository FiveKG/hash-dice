//@ts-check

async function autoEndGame() {
    //从 game 表里查找出 已经每个房间里最新的红包游戏，然后检查这个游戏的left_count 是不是 0 ， 如果是0 ，那么意味着这个游戏要结束，但还未结束
    let sql = `select g.*
    from 
    red_envelope_game g 
    join
     (
        select room_id , max(game_id) as game_id  from red_envelope_game group by room_id   
     ) as room_max_game
    on g.game_id = room_max_game.game_id
    where g.left_count = 0
    `
}

module.exports = autoEndGame;