// @ts-check
const logger = require("../common/logger.js");
const { OPEN_CODE_COUNT } = require("../common/constant/gameConstants");
const { rpc } = require("./getTrxAction");

/**
 * 获取开奖相关的区块信息
 * @param { number } blockNum
 * @returns { Promise<{ openCode: number[] , openResult: { id: string, block_num: number, timestamp: string }[] }> }
 */
async function getOpenResult(blockNum) {
    const openResult = [];
    let count = 0;
    let block_num = blockNum;
    // 获取开奖相关的区块信息
    while (true) {
        try {
            const resp = await rpc.get_block(block_num);
            const data = {
                timestamp: resp.timestamp,
                id: resp.id,
                block_num: resp.block_num
            }
            openResult.push(data);

            if (!isNaN(Number(resp.id.slice(-1)))) {
                count++;
            }

            if (count === OPEN_CODE_COUNT) {
                break;
            }
            logger.debug("count: ", count);
            block_num ++;
        } catch (err) {

        }
    }

    const openCode = [];
    for (const info of openResult) {
        const code = Number(info.id.slice(-1));
        if (!isNaN(code)) {
            openCode.push(code);
        }
    }
    return {
        openCode,
        openResult
    };
}

/**
 * 中奖用户分类
 * @param { number[] } openCode 
 * @param { Object } betOrderList 
 */
async function accReward(openCode, betOrderList) {
    const rewardMap = new Map();
    // 分配奖金
    for (const info of betOrderList) {
        const betNum = info.bet_num.split(",");
        // 中奖号码的位置
        const winCode = [];
        let winCount = 0;
        // reward_num: 0 , 8 , 9 , 0 , 1 , 2 , 1 , 8 , 7
        // bet_code:   0 , 2 , 9 , 0 , 9 , 2 , 2 , 8 , 7
        for (let i = 0; i < OPEN_CODE_COUNT; i++) {
            if (openCode[i] === betNum[i]) {
                // 中
                winCount++
                winCode[i] = 1
            } else {
                winCode[i] = 0
            }
        }

        // 统计所有 key 中奖的用户
        const accRewardInfo = rewardMap.get(winCount);
        if (!!accRewardInfo) {
            accRewardInfo.push({
                "bet_num": info.bet_num,
                "win_key": winCount,
                ...info
            })
        } else {
            const accRewardInfo = [{
                "bet_num": info.bet_num,
                "win_key": winCount,
                ...info
            }]
            rewardMap.set(winCount, accRewardInfo);
        }
    }

    return rewardMap;
}

module.exports = {
    accReward,
    getOpenResult
}