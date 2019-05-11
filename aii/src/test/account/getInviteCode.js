// @ts-check
const { redis } = require("../../common/index.js");

/**
 * 从 redis 里取出一个推荐码
 */
async function getInviteCode() {
    let code = await redis.spop("inviteCode");
    return code;
}

module.exports = {
    "getInviteCode": getInviteCode,
}