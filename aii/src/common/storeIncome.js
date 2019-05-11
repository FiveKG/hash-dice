// @ts-check
const redis = require("./redis.js");

/**
 * 
 * @param { String } accountName  
 * @param { String } hType
 * @param { Object } data 
 */
async function storeIncome(accountName, hType, data) {
    try {
        let key = `income:${ accountName }`;
        let isExist = await redis.hget(key, hType);
        let tmp = [];
        // 如果之前未收取，则一直积累
        console.log("isExist: ", typeof isExist, isExist);
        if (isExist) {
            tmp = JSON.parse(isExist);
            tmp.push(data);
            await redis.hset(key, hType, JSON.stringify(tmp));
        } else {
            tmp.push(data)
            await redis.hset(key, hType, JSON.stringify(tmp));
        }
    } catch (err) {
        throw err;
    }
}

module.exports = storeIncome;