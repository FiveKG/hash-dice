// @ts-check
const { JsonRpc } = require("eosjs");
const fetch = require("node-fetch");
const { WALLET_RECEIVER, SCATTER_NET } = require("../common/constant/eosConstants.js");
const request = require("request");

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
        const opts = {
            "pos": fromPosition,
            "offset": 9,
            "account_name": accountName
        }
        const url = `${ SCATTER_NET }/v1/history/get_actions`
        const result = await post(url, { data: opts });
        console.debug("result: ", result);
        let actions = result.actions;
        return actions;
    } catch (err) {
        console.error(`getAction error.`, err);
        throw err;
    }
}


async function getTrxAction(actionSeq) {
    try {
        // @ts-ignore
        const rpc = new JsonRpc(SCATTER_NET, { fetch });
        const resp = await rpc.history_get_actions(WALLET_RECEIVER, actionSeq, 9);
        console.debug("resp: ", resp);
        return resp.actions;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getAccountAction,
    getTrxAction
}