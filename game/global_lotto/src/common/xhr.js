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
 * GET方式请求
 * @param {String} api_url 请求 URL
 * @param {Option} [options] 配置项
 * @returns {Promise<Object>}
 */
async function get(api_url, options = {}) {
    try {
      const req_options = {
        uri: api_url,
        method: "get",
        json: true,
        headers: options.headers || {},
        qs: options.data || {}
      };

      return await asyncRequest(req_options);
    } catch (err) {
      throw err;
    }
  }

/**
 * POST方式请求
 * @param {String} api_url 请求 URL
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

module.exports = {
    get,
    post
  }
  
  /**
   * @description 配置项
   * @typedef {Object} Option
   * @property {Object} [headers] 请求头
   * @property {Object} [data] 请求参数
   */
  