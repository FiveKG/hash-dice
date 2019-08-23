// @ts-check
const { pool } = require("../db/index.js");
const logger = require("../common/logger.js").child({ "@src/job/tshIncomeAirdrop.js": "私募空投" });
const { Decimal } = require("decimal.js");
const { TSH_INCOME, TBG_TOKEN_COIN } = require("../common/constant/accountConstant.js");
const { END_POINT, PRIVATE_KEY_TEST, TBG_TOKEN_SYMBOL } = require("../common/constant/eosConstants.js");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only


/**
 * 多出的部分空投到股东池账户
 * @param {{ changeAmount: number, apId: number, memo: string, trId: string, price: number }} data
 */
async function tshIncomeAirdrop(data) {
    try {
        // 获取用户私募的资产信息
        const { changeAmount, memo } = data;
        const signatureProvider = new JsSignatureProvider([ PRIVATE_KEY_TEST ]);
        // @ts-ignore
        const rpc = new JsonRpc(END_POINT, { fetch });
        const now = new Date();
        // @ts-ignore
        // 区块链事务执行
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
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

        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
    } catch (err) {
        logger.error("airdrop to %s error, the error stock is %O", TSH_INCOME, err);
        throw err;
    }
}

module.exports = tshIncomeAirdrop