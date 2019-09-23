//@ts-check
require("./src/initEnv")();

/**
 * 把 originalStr 的长度，使用 padString 补充到指定长度。
 *
 * @param {string} originalStr
 * @param {number} targetLength
 * @param {string} padString
 * @returns {string}
 */
function padStart(originalStr , targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== 'undefined' ? padString : ' ');
    if (originalStr.length >= targetLength) {
        return String(originalStr);
    } else {
        targetLength = targetLength - originalStr.length;
        if (targetLength > padString.length) {
            padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(originalStr);
    }
}


function compare(a_gameResult, b_gameResult) {
    if (Number(a_gameResult.amount) < Number(b_gameResult.amount)) {           // 按某种排序标准进行比较, a 小于 b
        return -1;
    }
    if (Number(a_gameResult.amount) > Number(b_gameResult.amount)) {
      return 1;
    }
    // a must be equal to b
    return 0;
}

function testSort(){
     var ary = [
        {  "id" : 1 , "amount" : 0.0010 , "game_id": 1 , "account_name" : "aa" },
        {  "id" : 2 , "amount" : 0.0021 , "game_id": 1 , "account_name" : "bb" },
        {  "id" : 3 , "amount" : 0.0005 , "game_id": 1 , "account_name" : "cc" },
        {  "id" : 4 , "amount" : 0.1201 , "game_id": 1 , "account_name" : "dd" },
        {  "id" : 5 , "amount" : 0.0025 , "game_id": 1 , "account_name" : "ee" },
        {  "id" : 6 , "amount" : 0.1001 , "game_id": 1 , "account_name" : "ff" }
    ];

    ary.sort( compare);
    console.table(ary);
}

async function testInsertGame(){
    require("./src/initEnv.js")();
    var db = require("@fjhb/db-op").db;
    var room_data = {
        room_id: "ddd",
        left_count:5 ,
        total_count:5,//create_time
    }
    var result = await db.red_envelope_game.create(room_data );
    console.log(result.dataValues.game_id);
    process.exit();
}

( async() => {
    // var str = padStart("11" , 2 , "0");
    // console.log(str);
    // testInsertGame();
    // await endGame(140);
    // await testRecharge();
    // testConcat();    
    // testArray();
    // await testGetUserBalance();
    // getRandomItem();
    // console.log("over");

    // const { scheduleJob } = require("node-schedule");

    // const { generate } = require("shortid");
    // console.log(generate())

    console.log("你好啊");
} )();

// setInterval(() => {
//     console.log(Date.now())
// }, 1000)

function getRandomItem() {
    let ary = [ 
        '1111','2222','3333','4444','5555','66666','77777','8888888','99999999' ,
        "aaaa",'bbbb','ccccc','dddd','eeeee' ,'fffff' ,'gggggg' , 'hhhhhh','iiiiiii' , 'jjjjjjjj',
        'kkkkkkk' , 'LLLLLL' , "mmmmmmmmm" , 'nnnnnnnnn'
    ];

    let resultAry = getRandomArrayElements(ary , 4);
    console.log(resultAry);
}

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

async function testGetUserBalance() {
    require("./src/initEnv")();
    const eos_account = require("@fjhb/db-op").eos_account;
    const accountBalace = await eos_account.get_account_balance([ "jkgujnjkl233" ,"fjdhbrj23455" ,"xiaowei22334" , "zhenbao12344", "gjdjxync2233" ]);
    console.log(accountBalace);
}

async function testArray() {
    let ary = [
        { "a" : 1 , "b" : 1 },
        { "a" : 2 , "b" : 2 },
        { "a" : 3 , "b" : 3 },
        { "a" : 4 , "b" : 4 }
    ]
    let item = ary.find(t => { return t.a == 2});
    item.b = 11111;
    console.log(ary[1]);  //{ a: 2, b: 11111 }
}


async function endGame(game_id) {
    require("./src/initEnv")()
    const { endGame } = require("@fjhb/mq-pub-sub");
    await endGame.pub( {"game_id": game_id} );
    console.log(`${game_id} 游戏结束消息已发布`);
}

function testConcat() {
    var ary1 = [ {"a":1 ,"b":1} ]  , ary2 = [] , ary3 = [{"a":3 ,"b":3}]; 
    let ary = ary1.concat(ary2).concat(ary3);
    console.log(ary);
}

// db.sequelize.sync().then(() => {
//     console.log('complete')
// });

async function getAllTableName() {
    require("./src/initEnv")()
    const { db } = require("@fjhb/db-op")
    const getAllTableNameSql = `SELECT   tablename   FROM   pg_tables   
    WHERE   tablename   NOT   LIKE   'pg%'   
    AND tablename NOT LIKE 'sql_%' `

    db.sequelize.query(getAllTableNameSql, { "raw": true }).then( async res => {
        console.log(res[0]);
        for (let i = 0; i < res[0].length; ++i) {
            const tableName = res[0][i].tablename;
            console.log(tableName)

            // const sql = `drop table ${tableName};`
            // await db.sequelize.query(sql)
            if (tableName !== "eos_account") {
                const sql = `truncate ${tableName}`;
                await db.sequelize.query(sql);
            }
        }
        console.log('completed');
        process.exit(0)
    });
}



