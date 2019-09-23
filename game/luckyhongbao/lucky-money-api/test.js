//@ts-check
require("./initEnv")();
const redis = require("@fjhb/lm-redis");
const {
    room: roomBiz,
    club: clubBiz,
    common_data: commonDataBiz, 
    db
} = require("@fjhb/db-op");
const lodash = require("lodash");
const dateFns = require('date-fns');


(async () => {
    const sql1 = `
    select c.club_id, 
        c.club_name 
    from club c 
    join club_account ca 
    on c.club_id = ca.club_id 
    and c.is_enable = true 
    and ca.account_name = 'longchaomei1';`;

    const sql2 = `
    select 
        club_id , club_name 
    from 
        club 
    where 
        is_enable = true and 
        club_id in ( select club_id from club_account where account_name = 'longchaomei1' );`;

    console.time("sql1");
    for (let i = 0; i < 10000; i++) {
        await db.sequelize.query(sql1);
    }
    console.timeEnd("sql1");
    console.time("sql2");
    for (let i = 0; i < 10000; i++) {
        await db.sequelize.query(sql2);
    }
    console.timeEnd("sql2");
})()
