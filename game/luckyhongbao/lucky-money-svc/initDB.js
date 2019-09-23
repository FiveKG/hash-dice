//@ts-check
require("./src/initEnv.js")();
const redis = require("@fjhb/lm-redis");
const { generate: generateId } = require('shortid');
// const { collectionAccount, codeEosConnectInfo } = require("./src/common/sysConfig");
var { collectionAccount, codeEosConnectInfo } = require("@fjhb/sys_config")("redis");
const request = require("request");

/**
 * 异步请求方法
 * @param {Object} options 配置项
 * @returns {Promise}
 */
function asyncRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
        if (err) {
            return reject(err);
        }
        resolve(body);
        });
    });
}
  
/**
 * POST方式请求
 * @param {String} api_url 接口URL
 * @param {Option} [options] 配置项
 * @returns {Promise<Object>}
 */
async function post(api_url, options = {}) {
    try {
        const req_options = {
        uri: api_url,
        method: "post",
        json: true,
        headers: options.headers || {},
        body: options.data || {}
        };

        return await asyncRequest(req_options);
    } catch (err) {
        throw err;
    }
}

async function getLastPosition() {
    try {
        const [
            { httpEndpoint, chainId },
            { accountName }
        ] = await Promise.all([
            codeEosConnectInfo.get(),
            collectionAccount.get()
        ])

        const opts = {
            "pos": -1,
            "account_name": accountName
        }
        const url = `${ httpEndpoint }/v1/history/get_actions`
        const responseData = await post(url, { data: opts });
        // const responseData = await eos.getActions(accountName, -1);

        if (responseData.actions.length > 0) {
            return responseData.actions[responseData.actions.length - 1].account_action_seq;
        } else {
            return 0;
        }
    } catch (err) {
        throw err;
    }
}

async function syncModelToDb(){
    var db = require("@fjhb/db-op").db;
    try {
        await db.sequelize.sync();
        console.log(`db synced.`);
    } catch (error) {
        console.error(`sync db error.` , error);
    }
}

function delay(ms){
    var promise = new Promise( (resolve , reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
    return promise;
}

var official_club_room = {
    "club" :  { club_id : 952795 , club_name : "官方俱乐部" , refer_club_id: "" , creator_name : "system" , room_count: 3 },
    "room" :  [
        {  club_id : 952795 , amount: 0.1 , quantity: 5, account_name: "system"  } ,
        {  club_id : 952795 , amount: 0.5 , quantity: 5, account_name: "system"  } ,
        {  club_id : 952795 , amount: 1 ,   quantity: 5, account_name: "system"  } ,
    ]
}

async function initDefaultData (){
    var { db, club, room } = require("@fjhb/db-op");
    const format = require("date-fns/format");

    await db.sequelize.query(`DELETE FROM club WHERE club_id = 952795;`);
    await db.sequelize.query(`DELETE FROM room WHERE club_id = 952795;`);
    await db.sequelize.query(`ALTER SEQUENCE room_room_id_seq RESTART WITH 1`);

    // await club.create(official_club_room.club);
    await db.sequelize.query(`
    INSERT INTO club (
        id, club_id, club_name, refer_club_id, create_time, creator_name, room_count, is_enable
    ) 
    VALUES (
        '${generateId()}',
        ${official_club_room.club.club_id},
        '${official_club_room.club.club_name}',
        '${official_club_room.club.refer_club_id}',
        now(),
        '${official_club_room.club.creator_name}',
        ${official_club_room.club.room_count},
        true
    );`)

    // await db.eos_account.create({"account_name": "luckyhongbao" , "refer_name": "" });  //,  "balance": "1000000"
    await db.sequelize.query(`
    INSERT INTO eos_account(
        account_name, ref_account_name, create_time, balance
    ) 
    VALUES (
        'luckyhongbao', '', now(), 1000000
    ) 
    ON conflict(account_name) 
    DO UPDATE SET balance = 1000000;
    `);

    for (let i = 0; i < official_club_room.room.length; i++) {
        const roomInfo = official_club_room.room[i];
        console.log(roomInfo);
        // let result = await room.create(official_club_room.room[i]);

        await db.sequelize.query(`
        INSERT INTO room (
            club_id, amount, quantity, is_enable, create_time
        ) 
        VALUES (
            ${roomInfo.club_id},
            ${roomInfo.amount},
            ${roomInfo.quantity},
            true,
            now()
        );`)
    }

    await db.sequelize.query(`ALTER SEQUENCE room_room_id_seq RESTART WITH 201`);

    const game_result_amount_list = await redis.keys(`game_result_amount:*`);
    for (let key of game_result_amount_list) {
        console.log(`delete key: ${key}`);
        const res = await redis.del(key);
        console.log(`result: ${res}`);
    }

    await redis.del("lm:game:next_game_id");

    // lm:chain:last_pos
    const lastPos = await getLastPosition();
    console.log(`last position: ${lastPos}`);
    await redis.set("lm:chain:last_pos", lastPos);
}

async function sendStartNewGameMsg() {
    const { startNewGame } = require("@fjhb/mq-pub-sub");
    for (let idx = 0; idx < official_club_room.room.length; idx++) {
        const room = official_club_room.room[idx];
        await startNewGame.pub({
            "room_id"     : idx+1 ,
            "account_name": "luckyhongbao",
            "amount"      : room.amount,
            "quantity"    : room.quantity,
            "symbol"      : "UE",
            "isRoomFirstGame": true,
            "balance_type": "balance"
        });
        // return
    }
}

( async() => {
    await syncModelToDb();
    await initDefaultData();
    await sendStartNewGameMsg();
    console.log(`init complete`);

    // process.exit(0);
} )()

/**
 * @description 配置项
 * @typedef {Object} Option
 * @property {Object} [headers] 请求头
 * @property {Object} [data] 请求参数
 */