//@ts-check
require("./initEnv")();
var dbop = require("@fjhb/db-op");

/**
 * 添加官方俱乐部以及相关的红包房间
 */
async function addOfficalClub() {
    var club = {
        club_id : 123213,
        name : "官方俱乐部",
    };
    
    dbop.db.club.create(club);
}


( async() => {
    var flag = await dbop.db.sequelize.sync();
    // await addOfficalClub();
} )()
