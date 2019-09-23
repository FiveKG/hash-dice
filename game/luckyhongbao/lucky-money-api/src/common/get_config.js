// @ts-check
const config = require("../../config");

/**
 * 获取配置信息
 * @param {String} [key] 配置信息的字段
 */
function get_config(key) {
  return key ? config[key] : config;
}

module.exports = get_config;