//@ts-check
// var eosjs = require("eosjs");
var logger = require("@fjhb/logger").child({ [`@${ __filename }`]: "chainOperate" });
var sysConfig = require("./sysConfig.js");
const { Decimal } = require("decimal.js");
const request = require("request");
const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only

/**
 * 
 * @param { String[] } privateKeyList 私钥数组
 */
async function newApi(httpEndpoint, privateKeyList) {
    try {
        const signatureProvider = new JsSignatureProvider(privateKeyList);
        // @ts-ignore
        const rpc = new JsonRpc(httpEndpoint, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        return api;
    } catch (err) {
        throw err;
    }
}

process.env.NODE_ENV = "production";

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

/**
 * @description 配置项
 * @typedef {Object} Option
 * @property {Object} [headers] 请求头
 * @property {Object} [data] 请求参数
 */


/**
 * 从链上获取 指定用户，在指定位置开始的10条 action (转账) 记录
 * @param {string} accountName 账户名称.应为 系统的收款账户
 * @param {number} fromPosition 起始位置
 */
async function getAccountAction(accountName, fromPosition) {
    try {
        var eosConnectInfo = await sysConfig.codeEosConnectInfo.get();
        // logger.debug("eosConnectInfo: %O", eosConnectInfo);
        const opts = {
            "pos": fromPosition,
            "offset": 9,
            "account_name": accountName
        }

        const url = `${ eosConnectInfo.httpEndpoint }/v1/history/get_actions`
        const result = await post(url, { data: opts });
        let actions = result.actions;
        return actions;
    } catch (err) {
        logger.error(`getAction error.`, err);
        throw err;
    }
}


/**
 * @typedef GrabRedEnvelopeArgv
 * @property {number} gameId
 * @property {number} result_id
 * @property {string} accountName
 */

/**
 *  调用链上的 抢红包的合约.
 *
 * @param {GrabRedEnvelopeArgv} transferMsg 转账的消息
 * @returns {Promise<object>}
 */
async function grabRedEnvelope(transferMsg) {
    logger.debug(`chain op .grabRedEnvelope : %j`, transferMsg);
    try {
        var gameAdminAccount = await sysConfig.gameAdminAccount.get();
        let grabData = {
            "packet_id": transferMsg.gameId,
            "snatch_id": transferMsg.result_id,
            "player": transferMsg.accountName
        };
        logger.debug(`grabData:`, grabData);
        //  grabData.packet_id,
        //  grabData.snatch_id ,
        //  grabData.player,
        var eos_connect_info = await sysConfig.codeEosConnectInfo.get();
        logger.debug(`get gameAdminAccount:`, JSON.stringify(gameAdminAccount));
        var option = {
            keyProvider: gameAdminAccount.privateKey,
            httpEndpoint: eos_connect_info.httpEndpoint,
            chainId: eos_connect_info.chainId,
        };
        // @ts-ignore
        const api = await newApi(option.httpEndpoint, [ option.keyProvider ]);
        let actions = {
            actions: [{
              account: gameAdminAccount.accountName,
              name: "snatch",
              authorization: [{
                actor: gameAdminAccount.accountName,
                permission: 'active',
              }],
              data: {
                "packet_id": transferMsg.gameId,
                "snatch_id": transferMsg.result_id,
                "player": transferMsg.accountName
              }
            }]
          }
        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

        // var result = await contractObj.snatch(grabData.snatch_id, grabData.packet_id, grabData.player, { authorization: [gameAdminAccount.accountName] });
        logger.debug(` grabRedEnvelope result:  %j`, result);
        return result;
    } catch (error) {
        logger.error(`grabRedEnvelope error. %j`, error);
        throw error;
    }
}

/**
 * @typedef Offer 链上的 offer 表的结构
 * @property {number} snatch_id  红包游戏结果id(game_result_id)
 * @property {number} packet_id  红包游戏id(game_id)
 * @property {string} name     用户名
 * @property {string} amount 类似: 1.7694 EOS
 */

/**
 *创建 红包
 *
 * @param {CreateRedEnvelopeData} data
 */
async function create_red_envelope(data) {
    try {
        var gameAdminAccount = await sysConfig.gameAdminAccount.get();
        var eos_connect_info = await sysConfig.codeEosConnectInfo.get();
        logger.debug(`get gameAdminAccount:`, gameAdminAccount);
        var option = {
            keyProvider: gameAdminAccount.privateKey,
            httpEndpoint: eos_connect_info.httpEndpoint,
            chainId: eos_connect_info.chainId,
        };
        // @ts-ignore
        const api = await newApi(option.httpEndpoint, [ option.keyProvider ]);
        let actions = {
            actions: [{
                account: gameAdminAccount.accountName,
                name: "issue",
                authorization: [{
                    actor: gameAdminAccount.accountName,
                    permission: 'active',
                }],
                data: {
                "packet_id": data.game_id,
                "amount": data.amount,
                "owner": data.account_name,
                "player_account": data.quantity
                }
            }]
        }
        console.debug(`actions: `, actions.actions[0].data);
        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        // var result = await contractObj.issue(issueData.packet_id, issueData.amount, issueData.owner, issueData.player_account, { authorization: [gameAdminAccount.accountName] });
        logger.debug(`create_red_envelope result: %j `, result);
    } catch (error) {
        logger.error(`create_red_envelope error.`, error);
        throw error;
    }
}

/**
 * 退款. 用于 游戏结束后， 给非最多用户进行退款.
 *
 * @param {string} account_name
 * @param {string|number} amount
 * @param {string} symbol
 * @param {string} memo
 */
async function withdraw(account_name, amount, symbol, memo) {
    try {
        var transferAccount = await sysConfig.transferAccount.get();

        let withdrawData = {
            "accountName": account_name,
            "amount": amount,
            "memo": memo
        };
        logger.debug(`withdrawData:${JSON.stringify(withdrawData)} , transferAccount:${JSON.stringify(transferAccount)}`);

        var eosConnectInfo = await sysConfig.codeEosConnectInfo.get();
        let option = {
            "httpEndpoint": eosConnectInfo.httpEndpoint,
            "chainId": eosConnectInfo.chainId,
            "keyProvider": transferAccount.privateKey

        };
        // @ts-ignore
        const api = await newApi(option.httpEndpoint, [ option.keyProvider ]);
        let actions = {
            actions: [{
              account: "uetokencoin",
              name: "transfer",
              authorization: [{
                actor: transferAccount.accountName,
                permission: 'active',
              }],
              data: {
                from: transferAccount.accountName,
                to: account_name,
                quantity: `${ new Decimal(amount).toFixed(4) } ${ symbol }`,
                memo: memo,
              }
            }]
          }
        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

        // return result;
        // var result = await contractObj.transfer(transferAccount.accountName, account_name, `${new Decimal(amount).toFixed(4)} ${symbol}`, memo, { authorization: [transferAccount.accountName] });
        logger.debug(` withdraw result: %j`, result);
    } catch (error) {
        logger.error(`withdraw error. %j`, error);
        throw error;
    }
}

/**
 * 直接转账给用户, 用于 用户提现
 * @param {string} userAccountName 用户账号
 * @param {number} amount 转账数量
 * @param {string} symbol 代币符号
 * @param {string} memo 备注
 * @param {string} opts 操作类型 退款 | 代投
 */
async function directTransfer(userAccountName, symbol, amount, memo, opts) {
    try {
        logger.info(`directTransfer, userAccountName: ${userAccountName}, symbol: ${symbol}, amount: ${amount}, memo: ${memo}`);

        const [
            eosConnectInfo, 
            transferAccountInfo,
            publishSymbolAccountInfo
        ] = await Promise.all([
            sysConfig.codeEosConnectInfo.get(),
            sysConfig.transferAccount.get(),
            sysConfig.publish_symbol_account.get()
        ]);
        let from = transferAccountInfo.account_name;
        let to = userAccountName;

        if (opts !== "returns") {
          from = transferAccountInfo.agent_account;
          to = transferAccountInfo.accountName;
        }

        const tokenCode = symbol.toUpperCase();
        const signatureProvider = new JsSignatureProvider([ transferAccountInfo.privateKey, transferAccountInfo.agent_account_private_key ]);
        // @ts-ignore
        const rpc = new JsonRpc(eosConnectInfo.httpEndpoint, { fetch });
        // @ts-ignore
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        let actions = {
            actions: [{
              account: "uetokencoin",
              name: "transfer",
              authorization: [{
                actor: from,
                permission: 'active',
              }],
              data: {
                from: from,
                to: to,
                quantity: `${new Decimal(amount).toFixed(4)} ${tokenCode}`,
                memo: memo,
              }
            }]
          }
        const result = await api.transact(actions, {
            blocksBehind: 3,
            expireSeconds: 30,
        });

        return result;
    } catch (err) {
        logger.error(err, `directTransfer failed, userAccountName: ${userAccountName}, symbol: ${symbol}, amount: ${amount}, memo: ${memo}`);
        throw err;
    }
}

module.exports = {
    getAccountAction, 
    grabRedEnvelope, 
    create_red_envelope, 
    withdraw,
    directTransfer
}

/**
 * @typedef CreateRedEnvelopeData
 * @property {number} game_id  游戏id
 * @property {string} account_name 账户
 * @property {string} amount 红包金额
 * @property {number} quantity 数量
 */