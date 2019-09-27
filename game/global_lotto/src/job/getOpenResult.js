// @ts-check
const logger = require("../common/logger.js").child({ [`@${__filename}`]: "获取开奖相关的区块信息" });
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
        // 如果投注了多个 key 的号码，每组 9 位号码按竖线分割
        // eg: 1,2,3,4,5,6,7,8,9|9,8,7,6,5,4,3,2,1 如果选了相同号，也是如此
        const betNumGroup = info.bet_num.split("|");
        // logger.debug("betNumGroup: ", betNumGroup);
        for (const betInfo of betNumGroup) {
            const betNum = betInfo.split(",");
            // logger.debug("betNum: ", betNum);
            let winCount = 0;
            // reward_num: 0 , 8 , 9 , 0 , 1 , 2 , 1 , 8 , 7
            // bet_code:   0 , 2 , 9 , 0 , 9 , 2 , 2 , 8 , 7
            for (let i = 0; i < OPEN_CODE_COUNT; i++) {
                if (openCode[i] === Number(betNum[i])) {
                    // 中
                    winCount++;
                    // logger.debug("winCount: ", winCount);
                }
            }

            let obj = { ...info }
            obj.bet_num = betInfo
            // 统计所有 key 中奖的用户
            const accRewardInfo = rewardMap.get(winCount);
            // logger.debug("accRewardInfo: ", accRewardInfo);
            if (!!accRewardInfo) {
                accRewardInfo.push({ "win_key": winCount, ...obj});
                // logger.debug("--------accRewardInfo: ", accRewardInfo);
                rewardMap.set(winCount, accRewardInfo);
                // logger.debug("000000000000rewardMap: ", rewardMap);
            } else {
                const accRewardInfo = [{ "win_key": winCount,...obj }]
                // logger.debug("before winCount: ", winCount);
                rewardMap.set(winCount, accRewardInfo);
                // logger.debug("+++++++++++++++++++++++rewardMap: ", rewardMap.get(winCount));
                // console.debug("========================= rewardMap: ", rewardMap)
            }
        }
    }

    // console.debug("rewardMap: ", rewardMap);
    return rewardMap;
}

module.exports = {
    accReward,
    getOpenResult
}