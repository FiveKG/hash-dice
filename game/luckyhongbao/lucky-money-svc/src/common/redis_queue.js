// @ts-check
// require("../initEnv")()
const redis = require("@fjhb/lm-redis");
const prefix = 'queue';

/**
 * 添加数据
 * @param {String} key 键
 * @param {any[]} value 值
 */
async function push(key, value) {
  try {
    return await redis.rpush(`${prefix}:${key}`, ...value);
  } catch (err) {
    throw err;
  }
}

/**
 * 弹出数据
 * @param {String} key 键
 */
async function pop(key) {
  try {
    return await redis.lpop(`${prefix}:${key}`);
  } catch (err) {
    throw err;
  }
}

const keys = {
  "symbolTransfer": "symbolTransfer"
};

let instance = {};

instance.symbolTransfer = {
  /**
   * 添加数据
   * @param {SymbolTransfer[]} value 代币转账信息
   * @returns {Promise<number>}
   */
  async push(value) {
    let tmpList = [];
    for (let item of value) {
      tmpList.push(JSON.stringify(item));
    }
    return await push(keys.symbolTransfer, tmpList);
  },
  /**
   * 获取数据
   * @returns {Promise<SymbolTransfer>} 代币转账信息
   */
  async pop() {
    return JSON.parse(await pop(keys.symbolTransfer));
  }
}

module.exports = instance;

/**
 * @typedef {Object} SymbolTransfer
 * @property {String} account_name 账号
 * @property {String} symbol 代币符号
 * @property {Number} amount 代币数量
 * @property {String} memo 备注
 * @property {string} opts 操作类型 退款 | 代投
 */
