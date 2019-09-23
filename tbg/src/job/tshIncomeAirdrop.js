// @ts-check
const { psTrx } = require("../db/index.js");
const logger = require("../common/logger.js").child({ [`@${ __filename }`]: "多出的部分空投到股东池账户" });
const { Decimal } = require("decimal.js");
const { TSH_INCOME, TBG_TOKEN_COIN } = require("../common/constant/accountConstant.js");
const { TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");


/**
 * 多出的部分空投到股东池账户
 * @param {{ changeAmount: number, memo: string }} data
 */
async function tshIncomeAirdrop(data) {
    try {
        const { changeAmount, memo } = data;
        let actions = {
            actions: [
                {
                    account: TBG_TOKEN_COIN,
                    name: "transfer",
                    authorization: [{
                        actor: TBG_TOKEN_COIN,
                        permission: 'active',
                    }],
                    data: {
                        from: TBG_TOKEN_COIN,
                        to: TSH_INCOME,
                        quantity: `${ new Decimal(changeAmount).toFixed(4) } ${ TBG_TOKEN_SYMBOL }`,
                        memo: memo,
                    }
                }
            ]
        }
        // 发送区块链转帐消息
        await psTrx.pub(actions.actions);
    } catch (err) {
        logger.error("airdrop to %s error, the error stock is %O", TSH_INCOME, err);
        throw err;
    }
}

module.exports = tshIncomeAirdrop